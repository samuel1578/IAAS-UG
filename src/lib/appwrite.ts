import { Client, Account, Databases, Query, ID, Storage } from 'appwrite';

// Appwrite configuration using environment variables
const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID, // iaas_ug database
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  highlightsCollectionId: import.meta.env.VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID,
  coursesCollectionId: import.meta.env.VITE_APPWRITE_COURSES_COLLECTION_ID,
  materialsCollectionId: import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID,
  specializationsCollectionId: import.meta.env.VITE_APPWRITE_SPECIALIZATIONS_COLLECTION_ID,
  noticesCollectionId: import.meta.env.VITE_APPWRITE_NOTICES_COLLECTION_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  adminTeamId: import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID,
};

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Updated types based on your collection structure
export interface StudentUser {
  $id: string;
  email: string;
  name: string;
  level: string;
  studentId: number; // integer with max 8 digits
  department: 'Bsc_Agricultural_Science' | 'Bsc_Food_and_Consumer_Science'; // enum
  phoneNumber: number; // integer
  isVerified: boolean;
  isAdmin: boolean; // Admin flag
  createdAt: string;
  profileStatus: 'pending' | 'approved' | 'rejected';
  specialization?: string | null; // selected by this individual student (Level 300/400)
}

export interface StudentHighlight {
  $id: string;
  userId: string;
  studentName: string;
  level: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
}

export interface CourseMaterial {
  $id: string;
  courseCode: string;
  level: number;
  semester: number;
  year: number;
  materialType: 'lecture slides' | 'notes' | 'assignments' | 'recordings';
  title: string;
  description?: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedDate: string;
}

// Notice types (notices collection)
export type NoticeCategory = 'academic' | 'src' | 'event' | 'general' | 'opportunity';
export type NoticeStatus = 'draft' | 'published' | 'archived';
export type NoticePriority = 'normal' | 'important' | 'urgent';
export type NoticeAudience = 'all' | 'level_100' | 'level_200' | 'level_300' | 'level_400';

export interface Notice {
  $id: string;
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  status: NoticeStatus;
  priority: NoticePriority;
  audience: NoticeAudience;
  authorName: string;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Notice fields the admin form is allowed to supply on create.
export interface CreateNoticeInput {
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  audience: NoticeAudience;
  status: 'draft' | 'published';
  expiresAt?: string | null;
}

// Narrowly typed update payload (system-managed fields excluded).
export interface UpdateNoticeInput {
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  audience: NoticeAudience;
  expiresAt?: string | null;
}

// Authentication functions
export class AuthService {
  // Delete any currently active session so a fresh session can be created
  // without tripping Appwrite's "session is active" error. Safe to call when
  // no session exists — failures are swallowed (there was simply nothing to
  // delete). Shared by signIn and signUp.
  private static async clearExistingSession() {
    try {
      await account.deleteSession('current');
    } catch {
      // No existing session, continue
    }
  }

  // Sign up new user
  static async signUp(userData: {
    email: string;
    password: string;
    name: string;
    level: string;
    studentId: number;
    department: 'Bsc_Agricultural_Science' | 'Bsc_Food_and_Consumer_Science';
    phoneNumber: number;
  }) {
    try {
      // Validate studentId (max 8 digits)
      if (userData.studentId.toString().length > 8) {
        throw new Error('Student ID cannot exceed 8 digits');
      }

      // Create account
      const user = await account.create(
        ID.unique(),
        userData.email,
        userData.password,
        userData.name
      );

      // Establish an authenticated session for the new account BEFORE creating
      // the profile document. The profile document grants owner-level
      // (Role.user) permissions, which Appwrite only accepts once an active
      // session exists for that account — otherwise the request is treated as a
      // guest and rejects the permissions with "Permissions must be one of:
      // (any, guests)".
      // Clear any pre-existing session first to avoid "Creation of a session is
      // prohibited when a session is active".
      await AuthService.clearExistingSession();
      await account.createEmailPasswordSession(userData.email, userData.password);

      // Create user profile in database (fail fast if profile cannot be created)
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          user.$id,
          {
            email: userData.email,
            name: userData.name,
            level: userData.level,
            studentId: userData.studentId,
            department: userData.department,
            phoneNumber: userData.phoneNumber,
            isVerified: false,
            isAdmin: false,
            profileStatus: 'pending',
            createdAt: new Date().toISOString(),
          },
          // Grant the owner (the account that owns this profile) document-level
          // update permission so they can safely update only their own profile
          // fields (e.g. specialization) via the client SDK. Collection-level
          // update remains restricted to team:admins for protected fields.
          [`update("user:${user.$id}")`, `read("user:${user.$id}")`]
        );
      } catch (profileError: any) {
        console.error('Profile creation failed during signup. Attempting cleanup...', profileError);

        // Attempt to clean up orphaned account
        try {
          // To delete the account we just created via Client SDK, we need a session.
          await account.createEmailPasswordSession(userData.email, userData.password);
          await account.delete();
          console.log('Cleanup successful: Orphaned account deleted.');
        } catch (cleanupError) {
          console.error('Cleanup failed: Could not delete orphaned account.', cleanupError);
        }

        throw new Error(`Profile creation failed: ${profileError.message}. Please try again with correct data.`);
      }

      // A session is already established above (post account.create), so no
      // further sign-in is required here.

      return { success: true, user };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if an active session exists
  static async hasActiveSession() {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string) {
    try {
      // Check and delete existing session to prevent "session is active" error
      await AuthService.clearExistingSession();

      // Now create new session
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return { success: true, user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility: Create or sync user profile and mark as admin (for setup purposes)
  static async setupAdminUser(email: string) {
    try {
      // Find user by email
      const users = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        [Query.equal('email', email)]
      );

      if (users.documents.length === 0) {
        return { success: false, error: `User with email ${email} not found in database` };
      }

      const userDoc = users.documents[0];

      // Update user to set isAdmin = true
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        userDoc.$id,
        { isAdmin: true }
      );

      console.log(`✓ User ${email} marked as admin`);
      return { success: true, userId: userDoc.$id, isAdmin: true };
    } catch (error: any) {
      console.error('Setup admin user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const user = await account.get();
      return { success: true, user };
    } catch (error) {
      return { success: false, user: null };
    }
  }

  // Get user profile from database
  static async getUserProfile(userId: string) {
    try {
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        userId
      );
      return { success: true, profile: profile as StudentUser };
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message, errorCode: error?.code };
    }
  }

  // Create a minimal profile for an existing account (used for self-heal)
  static async createUserProfileFromAccount(user: any) {
    const safeName = user.name || user.email || 'Student';
    const now = new Date().toISOString();
    return databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.usersCollectionId,
      user.$id,
      {
        email: user.email,
        name: safeName,
        level: '100',
        studentId: 0,
        department: 'Bsc_Agricultural_Science',
        phoneNumber: 0,
        isVerified: false,
        isAdmin: false,
        profileStatus: 'pending',
        createdAt: now,
      },
      // Grant the owner document-level update permission so they can safely
      // update only their own profile fields (e.g. specialization) later.
      [`update("user:${user.$id}")`, `read("user:${user.$id}")`]
    );
  }

  // Canonical specialization options, mirrored from the UI source
  // (SPECIALIZATIONS in src/hooks/useAcademicHubData.ts). Keep the two lists in
  // sync. Used only to validate a requested value before persisting it.
  static readonly ALLOWED_SPECIALIZATIONS = [
    'Agricultural Economics',
    'Agribusiness',
    'Animal Science',
    'Crop Science',
    'Horticulture',
    'Postharvest Technology',
    'Soil Science',
    'Agricultural Extension',
  ];

  // Persist the authenticated student's selected specialization on their own
  // profile document. Only updates the `specialization` field.
  //
  // Security:
  // - Operates only on the current authenticated user's profile (user.$id).
  // - Validates the value against the canonical specialization list.
  // - Updates ONLY the specialization field; protected fields (isAdmin,
  //   isVerified, profileStatus, other users' docs) are never touched.
  static async updateUserSpecialization(specialization: string | null) {
    try {
      const user = await account.get();
      if (!user.$id) {
        return { success: false, error: 'No authenticated user' };
      }

      // Allow clearing (null) or a value from the canonical list only.
      if (specialization !== null && !AuthService.ALLOWED_SPECIALIZATIONS.includes(specialization)) {
        return { success: false, error: 'Invalid specialization value' };
      }

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        user.$id,
        { specialization }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Update user specialization error:', error);
      return { success: false, error: error.message };
    }
  }

  // Ensure profile exists
  static async ensureUserProfile(user: any) {
    const profileResult = await this.getUserProfile(user.$id);
    if (profileResult.success) {
      return profileResult;
    }

    // If profile is missing (404), do NOT auto-create a fake one.
    // Return a specific status so the UI can handle the incomplete profile state.
    if (profileResult.errorCode === 404) {
      return {
        success: false,
        error: 'Profile document missing',
        errorCode: 404,
        needsProfile: true
      };
    }

    return profileResult;
  }

  // Check if current user is admin by reading isAdmin flag from user profile
  static async isCurrentUserAdmin() {
    try {
      const user = await account.get();
      if (!user.$id) {
        return { success: true, isAdmin: false };
      }

      // Primary: check Appwrite user labels (preferred)
      const labels = Array.isArray((user as any).labels) ? (user as any).labels : [];
      const hasLabelAdmin = labels.includes('isadmin');

      if (hasLabelAdmin) {
        return { success: true, isAdmin: true };
      }

      // Fallback: check profile isAdmin flag
      const profile = await this.getUserProfile(user.$id);
      if (profile.success) {
        const isAdmin = profile.profile?.isAdmin || false;
        return { success: true, isAdmin };
      }

      return { success: true, isAdmin: false };
    } catch (error: any) {
      console.error('Admin check error:', error);
      return { success: false, isAdmin: false };
    }
  }
}

// Admin functions (for users with admin privileges)
export class AdminService {
  // Get all users for admin dashboard
  static async getAllUsers() {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        [Query.orderDesc('createdAt')]
      );
      return { success: true, users: result.documents as StudentUser[] };
    } catch (error: any) {
      console.error('Get all users error:', error);
      return { success: false, error: error.message };
    }
  }

  // Approve/reject user profile
  static async updateUserStatus(userId: string, status: 'approved' | 'rejected', isVerified?: boolean) {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        userId,
        {
          profileStatus: status,
          isVerified: isVerified ?? (status === 'approved'),
        }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Update user status error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user analytics
  static async getUserAnalytics() {
    try {
      const [totalUsers, pendingUsers, verifiedUsers, bscAgriUsers, bscFoodUsers] = await Promise.all([
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.select(['$id'])]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.equal('profileStatus', 'pending'), Query.select(['$id'])]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.equal('isVerified', true), Query.select(['$id'])]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.equal('department', 'Bsc_Agricultural_Science'), Query.select(['$id'])]
        ),
        databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.usersCollectionId,
          [Query.equal('department', 'Bsc_Food_and_Consumer_Science'), Query.select(['$id'])]
        ),
      ]);

      return {
        success: true,
        analytics: {
          totalUsers: totalUsers.total,
          pendingUsers: pendingUsers.total,
          verifiedUsers: verifiedUsers.total,
          approvedUsers: totalUsers.total - pendingUsers.total,
          bscAgricultureUsers: bscAgriUsers.total,
          bscFoodConsumerUsers: bscFoodUsers.total,
        }
      };
    } catch (error: any) {
      console.error('Get analytics error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Highlights functions
export class HighlightsService {
  // Check if user can create highlights (must be verified)
  static async canUserCreateHighlights(userId: string) {
    try {
      const result = await AuthService.getUserProfile(userId);
      return result.success && result.profile?.isVerified;
    } catch (error) {
      return false;
    }
  }

  // Create student highlight (only for verified users)
  static async createHighlight(highlightData: {
    userId: string;
    studentName: string;
    level: string;
    message: string;
  }) {
    try {
      // Check if user is verified
      const canCreate = await this.canUserCreateHighlights(highlightData.userId);
      if (!canCreate) {
        throw new Error('Only verified students can submit highlights');
      }

      const highlight = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.highlightsCollectionId,
        ID.unique(),
        {
          ...highlightData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      );
      return { success: true, highlight };
    } catch (error: any) {
      console.error('Create highlight error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get approved highlights for public display (newest first, bounded).
  static async getApprovedHighlights(limit = 3) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.highlightsCollectionId,
        [
          Query.equal('status', 'approved'),
          Query.orderDesc('createdAt'),
          Query.limit(Math.max(1, Math.min(limit, 50)))
        ]
      );
      return { success: true, highlights: result.documents as StudentHighlight[] };
    } catch (error: any) {
      console.error('Get approved highlights error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all highlights for admin moderation
  static async getAllHighlights() {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.highlightsCollectionId,
        [Query.orderDesc('createdAt')]
      );
      return { success: true, highlights: result.documents as StudentHighlight[] };
    } catch (error: any) {
      console.error('Get all highlights error:', error);
      return { success: false, error: error.message };
    }
  }

  // Approve/reject highlight
  static async updateHighlightStatus(
    highlightId: string,
    status: 'approved' | 'rejected',
    approvedBy: string
  ) {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.highlightsCollectionId,
        highlightId,
        { status, approvedBy }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Update highlight status error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete highlight
  static async deleteHighlight(highlightId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.highlightsCollectionId,
        highlightId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete highlight error:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark a user as admin by email address (utility function for setup)
  static async markUserAsAdmin(userEmail: string) {
    try {
      // Find user by email
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        [Query.equal('email', userEmail)]
      );

      if (result.documents.length === 0) {
        return { success: false, error: `User with email ${userEmail} not found` };
      }

      const user = result.documents[0];

      // Update user to set isAdmin = true
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.usersCollectionId,
        user.$id,
        { isAdmin: true }
      );

      console.log(`User ${userEmail} marked as admin (ID: ${user.$id})`);
      return { success: true, userId: user.$id };
    } catch (error: any) {
      console.error('Mark user as admin error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Course Materials functions
export class MaterialService {
  // Upload course material file and save metadata to database
  static async uploadMaterial(
    file: File,
    courseCode: string,
    materialType: 'lecture slides' | 'notes' | 'assignments' | 'recordings',
    title: string,
    description: string | undefined,
    uploadedBy: string,
    level: number,
    semester: number,
    year: number,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Upload file to storage
      const uploadedFile = await storage.createFile(
        APPWRITE_CONFIG.bucketId,
        ID.unique(),
        file,
        undefined,
        (progress) => {
          if (onProgress) {
            onProgress(Math.round(progress.progress));
          }
        }
      );

      // Create material metadata in database
      const material = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        ID.unique(),
        {
          courseCode,
          level,
          semester,
          year,
          materialType,
          title,
          description: description || '',
          fileUrl: uploadedFile.$id,
          uploadedBy,
          uploadedDate: new Date().toISOString(),
        }
      );

      return { success: true, material };
    } catch (error: any) {
      console.error('Upload material error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all materials for a specific course
  static async getMaterialsByCourse(courseCode: string) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        [Query.equal('courseCode', courseCode), Query.orderDesc('uploadedDate')]
      );
      return { success: true, materials: result.documents as CourseMaterial[] };
    } catch (error: any) {
      console.error('Get materials by course error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get materials filtered by type within a course
  static async getMaterialsByType(courseCode: string, materialType: string) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        [
          Query.equal('courseCode', courseCode),
          Query.equal('materialType', materialType),
          Query.orderDesc('uploadedDate'),
        ]
      );
      return { success: true, materials: result.documents as CourseMaterial[] };
    } catch (error: any) {
      console.error('Get materials by type error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete material (removes from both database and storage)
  static async deleteMaterial(materialId: string, fileId: string) {
    try {
      // Delete from database
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        materialId
      );

      // Delete file from storage
      await storage.deleteFile(APPWRITE_CONFIG.bucketId, fileId);

      return { success: true };
    } catch (error: any) {
      console.error('Delete material error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get download link for a file
  static getDownloadLink(fileId: string) {
    try {
      // If fileId is a full URL, extract the actual file ID
      let actualFileId = fileId;
      if (fileId.includes('/storage/buckets/')) {
        const parts = fileId.split('/');
        const filesIndex = parts.indexOf('files');
        if (filesIndex !== -1 && parts.length > filesIndex + 1) {
          actualFileId = parts[filesIndex + 1];
        }
      }
      return storage.getFileDownload(APPWRITE_CONFIG.bucketId, actualFileId);
    } catch (error: any) {
      console.error('Get download link error:', error);
      return null;
    }
  }

  // Get preview URL for a file
  static getPreviewLink(fileId: string) {
    try {
      // If fileId is a full URL, extract the actual file ID
      let actualFileId = fileId;
      if (fileId.includes('/storage/buckets/')) {
        const parts = fileId.split('/');
        const filesIndex = parts.indexOf('files');
        if (filesIndex !== -1 && parts.length > filesIndex + 1) {
          actualFileId = parts[filesIndex + 1];
        }
      }
      return storage.getFilePreview(APPWRITE_CONFIG.bucketId, actualFileId);
    } catch (error: any) {
      console.error('Get preview link error:', error);
      return null;
    }
  }

  // Get recent materials for a level + semester, newest first. Intended for the
  // Dashboard Home "Recent Materials" preview. Kept narrowly scoped: filters by
  // level and semester, orders by uploadedDate desc, and uses an efficient
  // limit. Course/specialization relevance is applied client-side by the caller
  // using the student's already-filtered course codes.
  static async getRecentMaterials(level: number, semester: number, limit = 3) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        [
          Query.equal('level', level),
          Query.equal('semester', semester),
          Query.orderDesc('uploadedDate'),
          Query.limit(limit * 5),
        ]
      );
      return { success: true, materials: result.documents as CourseMaterial[] };
    } catch (error: any) {
      console.error('Get recent materials error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all materials (for admin dashboard)
  static async getAllMaterials() {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.materialsCollectionId,
        [Query.orderDesc('uploadedDate')]
      );
      return { success: true, materials: result.documents as CourseMaterial[] };
    } catch (error: any) {
      console.error('Get all materials error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Course Catalog functions
export interface Course {
  $id?: string;
  code: string;
  title: string;
  credits: number;
  type: string;
  semester: number;
  level: number;
  description: string;
  prerequisites: string[];
  specialization: string[];
}

export class CourseService {
  // Get all courses for a specific level + semester
  static async getCoursesByLevelAndSemester(level: number, semester: number) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.coursesCollectionId,
        [Query.equal('level', level), Query.equal('semester', semester)]
      );
      return { success: true, courses: result.documents as Course[] };
    } catch (error: any) {
      console.error('Get courses by level/semester error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new course (document ID = course code)
  static async createCourse(courseData: Omit<Course, '$id'>) {
    try {
      const course = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.coursesCollectionId,
        ID.custom(courseData.code),
        courseData,
        ['read("any")']
      );
      return { success: true, course: course as Course };
    } catch (error: any) {
      console.error('Create course error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update an existing course
  static async updateCourse(documentId: string, courseData: Omit<Course, '$id'>) {
    try {
      const course = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.coursesCollectionId,
        documentId,
        courseData
      );
      return { success: true, course: course as Course };
    } catch (error: any) {
      console.error('Update course error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a course
  static async deleteCourse(documentId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.coursesCollectionId,
        documentId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete course error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Notice admin functions
export class NoticeService {
  // Resolve the safest author name for a notice.
  // Preferred order: profile name -> Appwrite account name -> fallback.
  static resolveAuthorName(user: any, userProfile: StudentUser | null): string {
    const name = userProfile?.name || user?.name;
    return (name && name.trim()) || 'IAAS-UG Admin';
  }

  // Get all notices, newest-created first. Admins only (Appwrite enforces).
  static async getAllNotices(limit = 100) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        [Query.orderDesc('createdAt'), Query.limit(limit)]
      );
      return { success: true, notices: result.documents as Notice[] };
    } catch (error: any) {
      console.error('Get all notices error:', error);
      return { success: false, error: error.message };
    }
  }

  // Student-facing read: published notices, newest-published first.
  // Audience + expiry filtering is applied client-side by the caller
  // (Appwrite queries cannot OR multiple audience values and cannot filter
  // "is null or greater than now" cleanly). Bounded limit keeps historical
  // archive fetches small. Never returns draft/archived records.
  static async getPublishedNotices(limit = 100) {
    try {
      const result = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        [Query.equal('status', 'published'), Query.orderDesc('publishedAt'), Query.limit(limit)]
      );
      return { success: true, notices: result.documents as Notice[] };
    } catch (error: any) {
      console.error('Get published notices error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a notice. System-managed fields (createdAt, updatedAt, authorName,
  // publishedAt) are generated here; the UI must not supply them.
  static async createNotice(
    input: CreateNoticeInput,
    authorName: string
  ) {
    try {
      const now = new Date().toISOString();
      const data: Record<string, unknown> = {
        title: input.title,
        summary: input.summary,
        content: input.content,
        category: input.category,
        status: input.status,
        priority: input.priority,
        audience: input.audience,
        authorName,
        createdAt: now,
        updatedAt: now,
        // Publishing a brand-new notice sets publishedAt; otherwise it is null.
        publishedAt: input.status === 'published' ? now : null,
        expiresAt: input.expiresAt || null,
      };

      const notice = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        ID.unique(),
        data
      );
      return { success: true, notice: notice as Notice };
    } catch (error: any) {
      console.error('Create notice error:', error);
      return { success: false, error: error.message };
    }
  }

  // Edit editable fields of an existing notice. Always bumps updatedAt.
  // Status is NOT changed here — status transitions use updateNoticeStatus.
  static async updateNotice(noticeId: string, input: UpdateNoticeInput) {
    try {
      const data: Record<string, unknown> = {
        title: input.title,
        summary: input.summary,
        content: input.content,
        category: input.category,
        priority: input.priority,
        audience: input.audience,
        updatedAt: new Date().toISOString(),
        expiresAt: input.expiresAt || null,
      };

      const notice = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        noticeId,
        data
      );
      return { success: true, notice: notice as Notice };
    } catch (error: any) {
      console.error('Update notice error:', error);
      return { success: false, error: error.message };
    }
  }

  // Dedicated status transition method. Keeps publishedAt rules consistent.
  //  - draft -> published: sets publishedAt = now
  //  - published -> draft: clears publishedAt = null
  //  - -> archived: preserves historical publishedAt when previously published
  static async updateNoticeStatus(
    noticeId: string,
    status: NoticeStatus,
    currentPublishedAt?: string | null
  ) {
    try {
      const now = new Date().toISOString();
      const data: Record<string, unknown> = {
        status,
        updatedAt: now,
      };

      if (status === 'published') {
        data.publishedAt = now;
      } else if (status === 'draft') {
        // Explicit unpublish: clear the publication timestamp.
        data.publishedAt = null;
      } else if (status === 'archived') {
        // Preserve historical publishedAt if the notice was previously published.
        data.publishedAt = currentPublishedAt || null;
      }

      const notice = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        noticeId,
        data
      );
      return { success: true, notice: notice as Notice };
    } catch (error: any) {
      console.error('Update notice status error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a notice by its Appwrite document ID. Admins only.
  static async deleteNotice(noticeId: string) {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.noticesCollectionId,
        noticeId
      );
      return { success: true };
    } catch (error: any) {
      console.error('Delete notice error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export configuration for easy access
export { APPWRITE_CONFIG };
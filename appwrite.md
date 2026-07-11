# Appwrite Project Configuration

This document describes the Appwrite project configuration reconstructed from the codebase.

## 1. Project Overview
- **Project Name**: IAAS-UG (Inferred)
- **Project ID**: Referenced via `VITE_APPWRITE_PROJECT_ID`
- **Endpoint**: Referenced via `VITE_APPWRITE_ENDPOINT`
- **Platforms**: Web (Vite/React)

## 2. Environment Variables
The following environment variables are used in `src/lib/appwrite.ts`:

| Variable Name | Purpose | Location |
|---------------|---------|----------|
| `VITE_APPWRITE_ENDPOINT` | API Endpoint URL | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite Project ID | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_DATABASE_ID` | Main Database ID (`iaas_ug`) | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_USERS_COLLECTION_ID` | Student Profiles Collection | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID` | Student Highlights Collection | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_MATERIALS_COLLECTION_ID` | Course Materials Metadata | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_COURSES_COLLECTION_ID` | Courses Placeholder | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_SPECIALIZATIONS_COLLECTION_ID` | Specializations Placeholder | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_BUCKET_ID` | File Storage for Materials | `src/lib/appwrite.ts` |
| `VITE_APPWRITE_ADMIN_TEAM_ID` | Admin Team ID | `src/lib/appwrite.ts` |

## 3. Databases & Collections

### Database: `iaas_ug` (ID: `VITE_APPWRITE_DATABASE_ID`)

#### Collection: `users` (ID: `VITE_APPWRITE_USERS_COLLECTION_ID`)
- **Description**: Stores extended student profile information.
- **Attributes**:
    - `email`: String, Required
    - `name`: String, Required
    - `level`: String, Required
    - `studentId`: Integer, Required (Max: 99,999,999)
    - `department`: Enum (`Bsc_Agricultural_Science`, `Bsc_Food_and_Consumer_Science`), Required
    - `phoneNumber`: Integer, Required
    - `isVerified`: Boolean, Default: `false`
    - `isAdmin`: Boolean, Default: `false`
    - `profileStatus`: Enum (`pending`, `approved`, `rejected`), Default: `pending`
    - `createdAt`: Datetime, Required
- **Indexes**:
    - `email_unique`: Key: `email`, Type: `unique`
    - `status_idx`: Key: `profileStatus`, Type: `key`
    - `verified_idx`: Key: `isVerified`, Type: `key`
    - `dept_idx`: Key: `department`, Type: `key`
- **Permissions**:
    - `role:all`: Read
    - `role:member`: Create
    - `user:[ID]`: Update (Self)
    - `team:[ADMIN_TEAM]`: Update, Delete

#### Collection: `highlights` (ID: `VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID`)
- **Description**: Student experience highlights.
- **Attributes**:
    - `userId`: String, Required
    - `studentName`: String, Required
    - `level`: String, Required
    - `message`: String, Required, Size: 1000
    - `status`: Enum (`pending`, `approved`, `rejected`), Default: `pending`
    - `createdAt`: Datetime, Required
    - `approvedBy`: String, Optional
- **Indexes**:
    - `status_idx`: Key: `status`, Type: `key`
    - `created_idx`: Key: `createdAt`, Type: `key`, Order: `DESC`
- **Permissions**:
    - `role:all`: Read (Filtered by status in app)
    - `role:member`: Create (Verified students only logic in app)
    - `team:[ADMIN_TEAM]`: Update, Delete

#### Collection: `materials` (ID: `VITE_APPWRITE_MATERIALS_COLLECTION_ID`)
- **Description**: Metadata for uploaded course materials.
- **Attributes**:
    - `courseCode`: String, Required
    - `level`: Integer, Required
    - `semester`: Integer, Required
    - `year`: Integer, Required
    - `materialType`: Enum (`lecture slides`, `notes`, `assignments`, `recordings`), Required
    - `title`: String, Required
    - `description`: String, Optional
    - `fileUrl`: String, Required (Storage File ID)
    - `uploadedBy`: String, Required
    - `uploadedDate`: Datetime, Required
- **Indexes**:
    - `course_idx`: Key: `courseCode`, Type: `key`
    - `type_idx`: Key: `materialType`, Type: `key`
    - `date_idx`: Key: `uploadedDate`, Type: `key`, Order: `DESC`
- **Permissions**:
    - `role:all`: Read
    - `team:[ADMIN_TEAM]`: Create, Update, Delete

## 4. Storage Buckets

### Bucket: `Materials` (ID: `VITE_APPWRITE_BUCKET_ID`)
- **Permissions**:
    - `role:all`: Read (Download/Preview)
    - `team:[ADMIN_TEAM]`: Create, Update, Delete
- **Allowed Extensions**: `pdf`, `pptx`, `mp4`, `docx`, `jpg`, `png`, `xlsx`
- **Max File Size**: 100MB (Enforced in app)
- **Encryption**: Enabled (Default)

## 5. Authentication
- **Methods**: Email/Password
- **Roles/Teams**:
    - `isadmin` (Label): Used for UI-level admin checks.
    - `Admin Team` (ID: `VITE_APPWRITE_ADMIN_TEAM_ID`): Used for database/storage permissions.
- **Patterns**:
    - Self-healing profiles: App creates a DB profile if a user exists but the profile document is missing.
    - Session management: Deletes existing session before creating a new one to avoid conflicts.

## 6. Realtime Subscriptions
- No explicit realtime subscriptions found in the current frontend code.

## 7. CLI Recreation Commands

```bash
# 1. Create Database
appwrite databases create --databaseId "$VITE_APPWRITE_DATABASE_ID" --name "IAAS UG Database"

# 2. Create Users Collection
appwrite databases createCollection --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --name "Users" --permissions 'read("any")' 'create("users")'

appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "email" --size 255 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "name" --size 255 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "level" --size 10 --required true
appwrite databases createIntegerAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "studentId" --required true --min 0 --max 99999999
appwrite databases createEnumAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "department" --elements "Bsc_Agricultural_Science" "Bsc_Food_and_Consumer_Science" --required true
appwrite databases createIntegerAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "phoneNumber" --required true
appwrite databases createBooleanAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "isVerified" --required false --default false
appwrite databases createBooleanAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "isAdmin" --required false --default false
appwrite databases createEnumAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "profileStatus" --elements "pending" "approved" "rejected" --required false --default "pending"
appwrite databases createDatetimeAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "createdAt" --required true

appwrite databases createIndex --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_USERS_COLLECTION_ID" --key "email_unique" --type "unique" --attributes "email"

# 3. Create Highlights Collection
appwrite databases createCollection --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --name "Highlights" --permissions 'read("any")' 'create("users")'

appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "userId" --size 36 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "studentName" --size 255 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "level" --size 10 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "message" --size 1000 --required true
appwrite databases createEnumAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "status" --elements "pending" "approved" "rejected" --required false --default "pending"
appwrite databases createDatetimeAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "createdAt" --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "approvedBy" --size 36 --required false

appwrite databases createIndex --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_HIGHLIGHTS_COLLECTION_ID" --key "status_idx" --type "key" --attributes "status"

# 4. Create Materials Collection
appwrite databases createCollection --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --name "Materials" --permissions 'read("any")'

appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "courseCode" --size 20 --required true
appwrite databases createIntegerAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "level" --required true
appwrite databases createIntegerAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "semester" --required true
appwrite databases createIntegerAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "year" --required true
appwrite databases createEnumAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "materialType" --elements "lecture slides" "notes" "assignments" "recordings" --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "title" --size 255 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "description" --size 1000 --required false
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "fileUrl" --size 36 --required true
appwrite databases createStringAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "uploadedBy" --size 36 --required true
appwrite databases createDatetimeAttribute --databaseId "$VITE_APPWRITE_DATABASE_ID" --collectionId "$VITE_APPWRITE_MATERIALS_COLLECTION_ID" --key "uploadedDate" --required true

# 5. Create Storage Bucket
appwrite storage createBucket --bucketId "$VITE_APPWRITE_BUCKET_ID" --name "Course Materials" --permissions 'read("any")' --fileSecurity true

# 6. Create Admin Team
appwrite teams create --teamId "$VITE_APPWRITE_ADMIN_TEAM_ID" --name "Admins"
```

## ## Needs Clarification
- **Placeholder Collections**: `VITE_APPWRITE_COURSES_COLLECTION_ID` and `VITE_APPWRITE_SPECIALIZATIONS_COLLECTION_ID` are defined but not used for data storage yet (mock data is used). Schemas for these are unknown.
- **Admin Permissions**: The CLI commands assume the `Admin Team` should have full access, but specific Appwrite roles for the collections (e.g., `update` permission for the `highlights` status) need to be manually assigned to the team ID in the console or via further CLI permission updates once the team is created.

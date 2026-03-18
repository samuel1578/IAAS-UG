import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService, StudentUser } from '../lib/appwrite';

// Authentication context types
interface AuthContextType {
  user: any | null;
  userProfile: StudentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  level: string;
  studentId: number;
  department: 'Bsc_Agricultural_Science' | 'Bsc_Food_and_Consumer_Science';
  phoneNumber: number;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<StudentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userResult = await AuthService.getCurrentUser();
      if (userResult.success && userResult.user) {
        setUser(userResult.user);

        // Ensure user profile exists (self-heal if missing)
        const profileResult = await AuthService.ensureUserProfile(userResult.user);
        if (profileResult.success) {
          setUserProfile(profileResult.profile as StudentUser);
        }

        // Check admin status
        const adminResult = await AuthService.isCurrentUserAdmin();
        setIsAdmin(adminResult.isAdmin);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await AuthService.signIn(email, password);

      if (result.success) {
        setUser(result.user);

        // Ensure user profile exists (self-heal if missing)
        const profileResult = await AuthService.ensureUserProfile(result.user);
        if (profileResult.success) {
          setUserProfile(profileResult.profile as StudentUser);
        }

        // Check admin status
        const adminResult = await AuthService.isCurrentUserAdmin();
        setIsAdmin(adminResult.isAdmin);
      }

      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      setIsLoading(true);
      const result = await AuthService.signUp(userData);

      if (result.success) {
        setUser(result.user);

        // Get the newly created profile
        const profileResult = await AuthService.getUserProfile(result.user.$id);
        if (profileResult.success) {
          setUserProfile(profileResult.profile as StudentUser);
        }
      }

      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileResult = await AuthService.getUserProfile(user.$id);
        if (profileResult.success) {
          setUserProfile(profileResult.profile);
        }
      } catch (error) {
        console.error('Profile refresh failed:', error);
      }
    }
  };

  const value = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { SignUpData };
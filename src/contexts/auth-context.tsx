import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase/config";
import { getUserStatus, type UserStatus } from "../firebase/user-status";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  firstName: string;
  userStatus: UserStatus | null;
  statusLoading: boolean;
  refreshUserStatus: () => Promise<UserStatus | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const getFirstName = (user: User | null) => {
  const source = user?.displayName?.trim() || user?.email?.trim() || "";

  if (!source) {
    return "";
  }

  return source.split(" ")[0];
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const loadUserStatus = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setUserStatus(null);
      setStatusLoading(false);
      return null;
    }

    const isCurrentUser = () => auth.currentUser?.uid === nextUser.uid;

    setStatusLoading(true);

    try {
      const status = await getUserStatus(nextUser.uid);

      if (isCurrentUser()) {
        setUserStatus(status);
      }

      return status;
    } catch {
      const fallbackStatus = {
        onboardingCompleted: false,
        profileCompleted: false,
      };

      if (isCurrentUser()) {
        setUserStatus(fallbackStatus);
      }

      return fallbackStatus;
    } finally {
      if (isCurrentUser()) {
        setStatusLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      void loadUserStatus(nextUser);
    });
  }, [loadUserStatus]);

  const refreshUserStatus = useCallback(() => {
    return loadUserStatus(auth.currentUser);
  }, [loadUserStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firstName: getFirstName(user),
        userStatus,
        statusLoading,
        refreshUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

import {
  createContext,
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

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        console.log("[AuthContext] User logged in:", nextUser.uid);
        setStatusLoading(true);
        try {
          const status = await getUserStatus(nextUser.uid);
          console.log("[AuthContext] User status loaded:", status);
          setUserStatus(status);
        } catch (error) {
          console.error("[AuthContext] Error loading status:", error);
          setUserStatus({
            onboardingCompleted: false,
            profileCompleted: false,
          });
        } finally {
          setStatusLoading(false);
        }
      } else {
        console.log("[AuthContext] User logged out");
        setUserStatus(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firstName: getFirstName(user),
        userStatus,
        statusLoading,
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

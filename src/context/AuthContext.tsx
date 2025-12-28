import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { UserProfile } from "../types/user";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { authService } from "../services/authService";

// Persisted auth data (stored in localStorage)
type PersistedAuthData = {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
};

// Full auth state including transient UI state
type AuthState = PersistedAuthData & {
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "jewellery-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Single source of truth for persisted data
  const {
    value: authData,
    setValue: setAuthData,
    remove: removeAuthData,
  } = useLocalStorage<PersistedAuthData>(AUTH_STORAGE_KEY, {
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // Separate ephemeral UI state (not persisted)
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { token, user } = await authService.login(email, password);
        // Functional update to avoid stale state
        setAuthData({
          isAuthenticated: true,
          token,
          user,
        });
      } catch (error) {
        // Functional update to avoid stale state
        setAuthData({
          isAuthenticated: false,
          token: null,
          user: null,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuthData],
  );

  const logout = useCallback(() => {
    removeAuthData();
    setIsLoading(false);
  }, [removeAuthData]);

  const refreshProfile = useCallback(async () => {
    if (!authData.token) {
      return;
    }

    setIsLoading(true);
    try {
      const profile: UserProfile = await authService.me(authData.token);
      // Functional update to avoid stale state
      setAuthData((prev) => ({
        ...prev,
        user: profile,
      }));
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [authData.token, logout, setAuthData]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authData,
      isLoading,
      login,
      logout,
      refreshProfile,
    }),
    [authData, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

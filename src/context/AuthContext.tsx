import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { AuthState, UserProfile } from '../types/user';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AUTH_STORAGE_KEY = 'jewellery-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { value: storedAuth, setValue, remove } = useLocalStorage<AuthState>(AUTH_STORAGE_KEY, {
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false
  });

  const [state, setState] = useState<AuthState>(storedAuth);

  const syncState = useCallback(
    (nextState: AuthState) => {
      setValue(nextState);
      setState(nextState);
    },
    [setValue]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      syncState({ ...state, isLoading: true });
      try {
        const { token, user } = await authService.login(email, password);
        const nextState: AuthState = {
          isAuthenticated: true,
          token,
          user,
          isLoading: false
        };
        syncState(nextState);
      } catch (error) {
        syncState({ ...state, isAuthenticated: false, token: null, user: null, isLoading: false });
        throw error;
      }
    },
    [state, syncState]
  );

  const logout = useCallback(() => {
    remove();
    setState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false
    });
  }, [remove]);

  const refreshProfile = useCallback(async () => {
    if (!state.token) {
      return;
    }

    syncState({ ...state, isLoading: true });
    try {
      const profile: UserProfile = await authService.me(state.token);
      syncState({
        ...state,
        user: profile,
        isLoading: false
      });
    } catch {
      logout();
    }
  }, [logout, state, syncState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refreshProfile
    }),
    [login, logout, refreshProfile, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

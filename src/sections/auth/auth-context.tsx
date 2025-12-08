import type { ReactNode } from 'react';

import { useState, useEffect, useContext, useCallback, createContext } from 'react';

import { authService, type UserResponse } from 'src/api/auth';

interface AuthContextType {
  isLoading: boolean;
  error: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user', err);
        localStorage.removeItem('accessToken');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { access_token } = await authService.login(email, password);
        localStorage.setItem('accessToken', access_token);

        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        error,
        user,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

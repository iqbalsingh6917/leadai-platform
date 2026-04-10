import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { authStore } from '@/store/auth.store';
import type { User } from '@/types';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          authStore.getToken(),
          authStore.getUser(),
        ]);
        setToken(storedToken);
        setUser(storedUser);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken, user: loggedInUser } = await authService.login(email, password);
      await Promise.all([
        authStore.setToken(accessToken),
        authStore.setUser(loggedInUser),
      ]);
      setToken(accessToken);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };
}

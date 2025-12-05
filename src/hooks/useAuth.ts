import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/game';
import { authApi } from '@/services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.login(email, password);
      if ('error' in result) {
        return { error: result.error };
      }
      setUser(result.user);
      return { user: result.user };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.signup(email, username, password);
      if ('error' in result) {
        return { error: result.error };
      }
      setUser(result.user);
      return { user: result.user };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}

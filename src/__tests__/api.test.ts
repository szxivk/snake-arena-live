import { describe, it, expect, beforeEach } from 'vitest';
import { authApi, leaderboardApi } from '@/services/api';

describe('Auth API', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const result = await authApi.signup('newuser@test.com', 'NewUser', 'password123');
      
      expect('user' in result).toBe(true);
      if ('user' in result) {
        expect(result.user.email).toBe('newuser@test.com');
        expect(result.user.username).toBe('NewUser');
        expect(result.user.id).toBeDefined();
      }
    });

    it('should reject duplicate email', async () => {
      await authApi.signup('duplicate@test.com', 'User1', 'password123');
      const result = await authApi.signup('duplicate@test.com', 'User2', 'password456');
      
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Email already registered');
      }
    });

    it('should reject duplicate username', async () => {
      await authApi.signup('user1@test.com', 'SameUsername', 'password123');
      const result = await authApi.signup('user2@test.com', 'SameUsername', 'password456');
      
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Username already taken');
      }
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      await authApi.signup('login@test.com', 'LoginUser', 'password123');
      await authApi.logout();
      
      const result = await authApi.login('login@test.com', 'password123');
      
      expect('user' in result).toBe(true);
      if ('user' in result) {
        expect(result.user.email).toBe('login@test.com');
      }
    });

    it('should reject invalid password', async () => {
      await authApi.signup('wrongpass@test.com', 'WrongPass', 'correctpassword');
      await authApi.logout();
      
      const result = await authApi.login('wrongpass@test.com', 'wrongpassword');
      
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Invalid email or password');
      }
    });

    it('should reject non-existent email', async () => {
      const result = await authApi.login('nonexistent@test.com', 'password123');
      
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error).toBe('Invalid email or password');
      }
    });
  });

  describe('logout', () => {
    it('should clear current user', async () => {
      await authApi.signup('logout@test.com', 'LogoutUser', 'password123');
      await authApi.logout();
      
      const currentUser = await authApi.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', async () => {
      localStorage.clear();
      const result = await authApi.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should restore user from localStorage', async () => {
      const user = { id: 'test-id', username: 'TestUser', email: 'test@test.com' };
      localStorage.setItem('snake_user', JSON.stringify(user));
      
      const result = await authApi.getCurrentUser();
      expect(result).toEqual(user);
    });
  });
});

describe('Leaderboard API', () => {
  describe('getLeaderboard', () => {
    it('should return all entries without filter', async () => {
      const entries = await leaderboardApi.getLeaderboard();
      
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);
    });

    it('should filter by walls mode', async () => {
      const entries = await leaderboardApi.getLeaderboard('walls');
      
      expect(Array.isArray(entries)).toBe(true);
      entries.forEach(entry => {
        expect(entry.mode).toBe('walls');
      });
    });

    it('should filter by pass-through mode', async () => {
      const entries = await leaderboardApi.getLeaderboard('pass-through');
      
      expect(Array.isArray(entries)).toBe(true);
      entries.forEach(entry => {
        expect(entry.mode).toBe('pass-through');
      });
    });

    it('should return entries sorted by score descending', async () => {
      const entries = await leaderboardApi.getLeaderboard();
      
      for (let i = 0; i < entries.length - 1; i++) {
        expect(entries[i].score).toBeGreaterThanOrEqual(entries[i + 1].score);
      }
    });
  });

  describe('submitScore', () => {
    it('should fail when not logged in', async () => {
      localStorage.clear();
      await authApi.logout();
      
      const result = await leaderboardApi.submitScore({
        score: 100,
        mode: 'walls',
      });
      
      expect(result.success).toBe(false);
    });

    it('should succeed when logged in', async () => {
      await authApi.signup('scorer@test.com', 'Scorer', 'password123');
      
      const result = await leaderboardApi.submitScore({
        score: 500,
        mode: 'walls',
      });
      
      expect(result.success).toBe(true);
      expect(result.rank).toBeDefined();
    });
  });
});

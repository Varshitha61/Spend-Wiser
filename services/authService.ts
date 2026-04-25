import { User } from '../types';

const SESSION_KEY = 'smartspend_session_v1';

export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const user = await response.json();
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  register: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const user = await response.json();
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  updateProfile: async (userId: string, name?: string, password?: string): Promise<User> => {
    try {
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      const user = await response.json();
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  }
};

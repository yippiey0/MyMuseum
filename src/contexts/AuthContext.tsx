import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { db } from '../lib/db';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  toggleFavorite: (exhibitId: number) => Promise<void>;
  getFavorites: () => Promise<number[]>;
  addRecentlyViewed: (exhibitId: number) => Promise<void>;
  getRecentlyViewed: () => Promise<number[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ? AND password = ?',
        args: [email, password]
      });

      if (result.rows.length > 0) {
        const userData = result.rows[0];
        const user = {
          id: userData.id as string,
          name: userData.name as string,
          email: userData.email as string,
          role: userData.role as 'admin' | 'user'
        };
        
        setUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.role === 'admin');
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userId = crypto.randomUUID();
      await db.execute({
        sql: 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        args: [userId, name, email, password, 'user']
      });

      const user = { id: userId, name, email, role: 'user' as const };
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const toggleFavorite = async (exhibitId: number) => {
    if (!user) return;

    try {
      const exists = await db.execute({
        sql: 'SELECT 1 FROM favorites WHERE userId = ? AND exhibitId = ?',
        args: [user.id, exhibitId]
      });

      if (exists.rows.length > 0) {
        await db.execute({
          sql: 'DELETE FROM favorites WHERE userId = ? AND exhibitId = ?',
          args: [user.id, exhibitId]
        });
      } else {
        await db.execute({
          sql: 'INSERT INTO favorites (userId, exhibitId) VALUES (?, ?)',
          args: [user.id, exhibitId]
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const getFavorites = async (): Promise<number[]> => {
    if (!user) return [];

    try {
      const result = await db.execute({
        sql: 'SELECT exhibitId FROM favorites WHERE userId = ?',
        args: [user.id]
      });

      return result.rows.map(row => row.exhibitId as number);
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  };

  const addRecentlyViewed = async (exhibitId: number) => {
    if (!user) return;

    try {
      await db.execute({
        sql: `
          INSERT INTO recently_viewed (userId, exhibitId)
          VALUES (?, ?)
          ON CONFLICT (userId, exhibitId)
          DO UPDATE SET viewedAt = CURRENT_TIMESTAMP
        `,
        args: [user.id, exhibitId]
      });

      // Keep only the 5 most recent
      await db.execute({
        sql: `
          DELETE FROM recently_viewed
          WHERE userId = ? AND exhibitId NOT IN (
            SELECT exhibitId
            FROM recently_viewed
            WHERE userId = ?
            ORDER BY viewedAt DESC
            LIMIT 5
          )
        `,
        args: [user.id, user.id]
      });
    } catch (error) {
      console.error('Add recently viewed error:', error);
    }
  };

  const getRecentlyViewed = async (): Promise<number[]> => {
    if (!user) return [];

    try {
      const result = await db.execute({
        sql: `
          SELECT exhibitId
          FROM recently_viewed
          WHERE userId = ?
          ORDER BY viewedAt DESC
          LIMIT 5
        `,
        args: [user.id]
      });

      return result.rows.map(row => row.exhibitId as number);
    } catch (error) {
      console.error('Get recently viewed error:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        register,
        toggleFavorite,
        getFavorites,
        addRecentlyViewed,
        getRecentlyViewed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- ДОБАВЛЕНО: тип роли пользователя ---
export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// --- Новые типы контекста ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  toggleFavorite: (exhibitId: number) => void;
  getFavorites: () => number[];
  addRecentlyViewed: (exhibitId: number) => void;
  getRecentlyViewed: () => number[];
  // --- Админ-функции ---
  getUsers: () => User[];
  setRole: (userId: number, newRole: UserRole) => void;
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

// --- Helpers для users ---
const USERS_KEY = 'users';

// Получить всех пользователей
const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Сохранить всех пользователей
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on page load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
    // --- Инициализация первого админа ---
    if (!localStorage.getItem(USERS_KEY)) {
      // Первый пользователь — админ
      const admin: User = {
        id: 1,
        name: 'Администратор',
        email: 'admin@example.com',
        role: 'admin',
      };
      saveUsersToStorage([admin]);
    }
  }, []);

  // --- login: ищет пользователя в общем списке ---
  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    // Для простоты пароль не используется
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem(`favorites_${user.id}`);
      localStorage.removeItem(`recentlyViewed_${user.id}`);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // --- register с поддержкой ролей ---
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    if (users.some(u => u.email === email)) return false;
    // Первый пользователь в системе — админ, остальные — user
    const role: UserRole = users.length === 0 ? 'admin' : 'user';
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      role,
    };
    const updated = [...users, newUser];
    saveUsersToStorage(updated);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  // --- Управление ролями ---
  const setRole = (userId: number, newRole: UserRole) => {
    const users = getUsersFromStorage();
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    saveUsersToStorage(updated);
    // Если меняется текущий пользователь
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // --- Получить всех пользователей ---
  const getUsers = (): User[] => getUsersFromStorage();

  // --- Ваши существующие методы избранного и просмотров ---
  const toggleFavorite = (exhibitId: number) => {
    if (!user) return;

    const favorites = getFavorites();
    const newFavorites = favorites.includes(exhibitId)
      ? favorites.filter(id => id !== exhibitId)
      : [...favorites, exhibitId];

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  const getFavorites = (): number[] => {
    if (!user) return [];

    try {
      const favorites = localStorage.getItem(`favorites_${user.id}`);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Failed to parse favorites', error);
      return [];
    }
  };

  const addRecentlyViewed = (exhibitId: number) => {
    if (!user) return;

    const recentlyViewed = getRecentlyViewed();
    const newRecentlyViewed = [
      exhibitId,
      ...recentlyViewed.filter(id => id !== exhibitId)
    ].slice(0, 5);

    localStorage.setItem(`recentlyViewed_${user.id}`, JSON.stringify(newRecentlyViewed));
  };

  const getRecentlyViewed = (): number[] => {
    if (!user) return [];

    try {
      const recentlyViewed = localStorage.getItem(`recentlyViewed_${user.id}`);
      return recentlyViewed ? JSON.parse(recentlyViewed) : [];
    } catch (error) {
      console.error('Failed to parse recently viewed', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        toggleFavorite,
        getFavorites,
        addRecentlyViewed,
        getRecentlyViewed,
        // --- Новое ---
        getUsers,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
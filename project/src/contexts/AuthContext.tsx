import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

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
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock users for demo
    const mockUsers = [
      { id: 1, name: 'Иван Петров', email: 'ivan@example.com', password: 'password123' },
      { id: 2, name: 'Мария Иванова', email: 'maria@example.com', password: 'password123' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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

  const register = async (name: string, email: string): Promise<boolean> => {
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name,
      email
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

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
    ].slice(0, 5); // Keep only the 5 most recent

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
        getRecentlyViewed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
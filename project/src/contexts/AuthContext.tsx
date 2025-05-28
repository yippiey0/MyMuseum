import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getFavorites: () => number[];
  toggleFavorite: (id: number) => void;
  getRecentlyViewed: () => number[];
  addRecentlyViewed: (id: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  getFavorites: () => [],
  toggleFavorite: () => {},
  getRecentlyViewed: () => [],
  addRecentlyViewed: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameOrEmail, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const userObj: User = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        setUser(userObj);
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const userObj: User = {
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        };
        setUser(userObj);
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Избранное (ID экспонатов)
  const getFavorites = (): number[] => {
    const fav = localStorage.getItem('favorites');
    return fav ? JSON.parse(fav) as number[] : [];
  };

  const toggleFavorite = (id: number) => {
    const favorites = getFavorites();
    let updated: number[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Недавно просмотренные (ID экспонатов, максимум 20)
  const getRecentlyViewed = (): number[] => {
    const rec = localStorage.getItem('recentlyViewed');
    return rec ? JSON.parse(rec) as number[] : [];
  };

  const addRecentlyViewed = (id: number) => {
    let recents = getRecentlyViewed();
    recents = recents.filter(item => item !== id);
    recents.unshift(id);
    if (recents.length > 20) recents = recents.slice(0, 20);
    localStorage.setItem('recentlyViewed', JSON.stringify(recents));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
      getFavorites,
      toggleFavorite,
      getRecentlyViewed,
      addRecentlyViewed,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
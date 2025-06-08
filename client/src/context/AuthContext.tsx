import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

// Sample users for demo - replace with backend API in production
const sampleUsers: (User & { password: string })[] = [
  {
    id: 1,
    email: 'admin@kenyabespoke.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        if (parsedUser.id && parsedUser.email && parsedUser.name && parsedUser.role) {
          setUser(parsedUser);
        } else {
          console.warn('Invalid user data in localStorage, clearing it.');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call (replace with real API call in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundUser = sampleUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Log parameters to suppress TS6133 and aid debugging
    console.log('Registration attempt:', { name, email, password });
    // Registration is disabled for this free website with only admin accounts
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
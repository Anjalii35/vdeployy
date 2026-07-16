import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setChecking(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data);
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    validate();
  }, []);

  const login = async (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user context profile after login validation:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn: !!token, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
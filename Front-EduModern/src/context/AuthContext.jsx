import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TOKEN_KEY = 'edu_token';
const ASPNET_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const ASPNET_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const ASPNET_NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const ASPNET_EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';

export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return {
      id: decoded.id || decoded.userId || decoded.nameid || decoded.sub || decoded[ASPNET_ID_CLAIM] || '',
      email: decoded.email || decoded[ASPNET_EMAIL_CLAIM] || decoded[ASPNET_NAME_CLAIM] || '',
      name: decoded.name || decoded['fullName'] || decoded[ASPNET_NAME_CLAIM] || '',
      role: (() => {
        const r = decoded.role ?? decoded.roles ?? decoded[ASPNET_ROLE_CLAIM] ?? '';
        return Array.isArray(r) ? r[0] || '' : String(r || '');
      })(),
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  const user = decodeToken(token);
  if (!user) return false;
  return user.exp * 1000 > Date.now();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored && isTokenValid(stored) ? stored : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored && isTokenValid(stored) ? decodeToken(stored) : null;
  });

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const decoded = decodeToken(newToken);
    setUser(decoded);
    return decoded;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded) return;
    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(logout, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;

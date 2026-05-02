import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const requires2FA = Cookies.get('requires2FA');

    if (token && !requires2FA) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/profile')
        .then(res => { setUser(res.data); setLoading(false); })
        .catch(() => { Cookies.remove('token'); setLoading(false); });
    } else if (requires2FA) {
      setLoading(false);
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    Cookies.set('token', res.data.token, { expires: 30 });
    Cookies.set('requires2FA', 'true', { expires: 1 });
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data;
  };

  const verify2FA = async (passkey) => {
    const res = await api.post('/auth/verify-2fa', { passkey });
    if (res.data.verified) {
      Cookies.remove('requires2FA');
      const profileRes = await api.get('/auth/profile');
      setUser(profileRes.data);
      return true;
    }
    return false;
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('requires2FA');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verify2FA, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

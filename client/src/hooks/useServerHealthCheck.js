import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function useServerHealthCheck(intervalMs = 300000) {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    const pingServer = async () => {
      try {
        await api.get('/health', { timeout: 5000 });
      } catch (err) {
        if (err.code === 'ECONNABORTED' || !err.response) {
          navigate('/network-error');
        }
      }
    };

    pingServer();

    intervalRef.current = setInterval(pingServer, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigate, intervalMs]);
}

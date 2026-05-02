import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useContext as useAuthContext } from 'react';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', { withCredentials: true });
      newSocket.on('connect', () => {
        newSocket.emit('join', user._id);
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

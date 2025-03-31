import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import axiosInstance from '../lib/axios';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'viajero' | 'anfitrión' | 'ambos';
  location?: string;
  climbingStyles: string[];
  level?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Recupera usuario desde localStorage + backend al iniciar
  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (token) {
      axiosInstance
        .get('/api/users/me')
        .then(res => setUserState(res.data))
        .catch(() => {
          setUserState(null);
          localStorage.removeItem('googleToken');
        });
    }
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      setUserState(user);
    } else {
      setUserState(null);
      localStorage.removeItem('googleToken');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
  return context;
};

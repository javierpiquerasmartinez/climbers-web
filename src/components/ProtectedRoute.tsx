import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/" replace />;
}

import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Cargando...</div>;
  }
  return user ? children : <Navigate to="/" replace />;
}

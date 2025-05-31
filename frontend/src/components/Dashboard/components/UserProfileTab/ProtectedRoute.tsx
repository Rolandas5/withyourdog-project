import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Kraunama...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
}

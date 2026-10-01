import { Navigate } from 'react-router-dom';
import { decodeToken } from '../context/AuthContext';

function dashboardForRole(role) {
  const r = (role || '').toLowerCase();
  if (r === 'admin') return '/admin';
  if (r === 'instructor' || r === 'teacher') return '/instructor';
  return '/courses';
}

export default function ProtectedRoute({ children, requiredRole }) {
  const storedToken = localStorage.getItem('edu_token') || localStorage.getItem('token');

  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  const user = decodeToken(storedToken);

  if (!user) {
    localStorage.removeItem('edu_token');
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || '').toLowerCase();

  if (requiredRole && userRole !== requiredRole.toLowerCase()) {
    return <Navigate to={dashboardForRole(userRole)} replace />;
  }

  return children;
}

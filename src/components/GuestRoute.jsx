import { Navigate } from 'react-router-dom';
import { decodeToken } from '../context/AuthContext';

export default function GuestRoute({ children }) {
  const storedToken = localStorage.getItem('edu_token') || localStorage.getItem('token');

  if (!storedToken) {
    return children;
  }

  const user = decodeToken(storedToken);

  if (!user) {
    localStorage.removeItem('edu_token');
    localStorage.removeItem('token');
    return children;
  }

  const role = (user.role || '').toLowerCase();

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'instructor' || role === 'teacher') {
    return <Navigate to="/instructor" replace />;
  }

  return <Navigate to="/courses" replace />;
}

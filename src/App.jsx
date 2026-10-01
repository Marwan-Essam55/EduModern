import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GuestRoute     from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';

import Home             from './components/Home';
import Login            from './components/Auth/Login';
import Register         from './components/Auth/Register';
import CoursesDashboard from './components/CoursesDashboard/CoursesDashboard';
import CourseCatalog    from './components/CourseCatalog/CourseCatalog';
import MyCourses        from './components/MyCourses';
import LearningRoom     from './components/LearningRoom/LearningRoom';
import UserProfile      from './components/UserProfile';
import SuperAdminDashboard from './components/Admin/SuperAdminDashboard';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import AdminDashboard      from './components/Admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/"        element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/home"    element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/login"   element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        <Route path="/courses"  element={<CourseCatalog />} />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute requiredRole="Student">
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute requiredRole="Student">
              <LearningRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor"
          element={
            <ProtectedRoute requiredRole="Instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="Instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute requiredRole="Instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses-dashboard"
          element={
            <ProtectedRoute requiredRole="Instructor">
              <CoursesDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-control"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

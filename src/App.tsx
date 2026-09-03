import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyLookup } from './pages/VerifyLookup';
import { AdminStudents } from './pages/AdminStudents';
import { AdminStudentForm } from './pages/AdminStudentForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyLookup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students/new"
              element={
                <ProtectedRoute>
                  <AdminStudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminStudentForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageLoader from './components/PageLoader';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FamilyTree from './pages/FamilyTree';
import CreateFamily from './pages/CreateFamily';
import Search from './pages/Search';
import EditRequests from './pages/EditRequests';
import AdminEditRequests from './pages/AdminEditRequests';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader fullScreen={true} />;
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family/create"
        element={
          <ProtectedRoute>
            <CreateFamily />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family/:familyId"
        element={
          <ProtectedRoute>
            <FamilyTree />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-requests"
        element={
          <ProtectedRoute>
            <EditRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-requests/admin"
        element={
          <ProtectedRoute>
            <AdminEditRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-requests/admin/:familyId"
        element={
          <ProtectedRoute>
            <AdminEditRequests />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

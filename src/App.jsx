import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Emotions from './pages/Emotions';
import History from './pages/History';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import { AuthProvider } from './auth/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProtectedRoute from './router/ProtectedRoute';
import Home from './pages/Home/Home';
import ErrorBoundary from './components/ErrorBoundary';
import CreateFlow from './pages/Create/CreateFlow';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route path="home" element={<Home />} />
                <Route path="emotions" element={<Emotions />} />
                <Route path="history" element={<History />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="create" element={<CreateFlow />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 
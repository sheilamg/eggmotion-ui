import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Retrospective from './pages/Retrospective';
import Journal from './pages/Journal/JournalPage';
import Settings from './pages/Settings/Settings';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Welcome from './pages/Welcome/Welcome';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Onboarding from './pages/Onboarding/Onboarding';
import ProtectedRoute from './router/ProtectedRoute';
import Home from './pages/Home/Home';
import DailyQuoteView from './pages/Quote/DailyQuoteView';
import FavoriteQuotes from './pages/Quote/FavoriteQuotes';
import Privacy from './pages/Privacy/Privacy';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy" element={<Privacy />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={<AppShell />}>
                  <Route index element={<Navigate to="/home" replace />} />
                  <Route path="home" element={<Home />} />
                  <Route path="quote/:id" element={<DailyQuoteView />} />
                  <Route path="quotes/favorites" element={<FavoriteQuotes />} />
                  <Route path="history" element={<History />} />
                  <Route path="history/:entryId" element={<History />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="journal/:id" element={<Journal />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="analytics/retrospective" element={<Retrospective />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="calendar" element={<Navigate to="/history" replace />} />
                  <Route path="emotions" element={<Navigate to="/home" replace />} />
                  <Route path="create" element={<Navigate to="/home" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNav from './components/layout/BottomNav';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import TrackPage from './pages/TrackPage';
import ProfilePage from './pages/ProfilePage';
import AIChatPage from './pages/AIChatPage';
import AboutPage from './pages/AboutPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/common/Toast';

function App() {
  // Auth state: check if a JWT token exists in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('cm_authenticated') === 'true' && !!localStorage.getItem('cm_token');
  });

  // Re-check auth on storage changes (e.g., token cleared by API client on 401)
  useEffect(() => {
    const handleStorage = () => {
      const hasToken = !!localStorage.getItem('cm_token');
      const hasAuth = localStorage.getItem('cm_authenticated') === 'true';
      setIsAuthenticated(hasToken && hasAuth);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('cm_token', token);
    localStorage.setItem('cm_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cm_authenticated');
    localStorage.removeItem('cm_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <AppProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/application/:id" element={<ApplicationDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
            <Toast />
          </div>
        </AppProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

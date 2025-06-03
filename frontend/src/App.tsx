import {
  useLocation,
  Routes,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/NavBar/Navbar';
import Home from './pages/HomePage/HomePage';
import LoginRegisterModal from './pages/auth/LoginRegisterModal/LoginRegisterModal';
import Places from './pages/explore/places/Places/Places';
import Hotels from './pages/explore/places/Hotels/Hotels';
import Beaches from './pages/explore/places/Beaches/Beaches';
import Parks from './pages/explore/places/Parks/Parks';
import Services from './pages/explore/services/Services';
import NotFound from './pages/NotFound/NotFound';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProtectedRoute } from './components/Dashboard/components/UserProfileTab/ProtectedRoute';
import WeatherPage from './components/WeatherPage/WeatherPage';

function AppContent() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  // uždaro modalą, kai keičiasi URL
  useEffect(() => {
    setShowModal(false);
  }, [location]);

  const openModal = (mode: 'login' | 'register') => {
    console.log('openModal got called with mode:', mode);
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <AuthProvider>
      <Navbar
        onLoginClick={() => openModal('login')}
        onRegisterClick={() => openModal('register')}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/places" element={<Places />} />
        <Route path="/places/hotels" element={<Hotels />} />
        <Route path="/places/beaches" element={<Beaches />} />
        <Route path="/places/parks" element={<Parks />} />
        <Route path="/services" element={<Services />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showModal &&
        (console.log('Modal should show now!'),
        (<LoginRegisterModal mode={modalMode} onClose={closeModal} />))}
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

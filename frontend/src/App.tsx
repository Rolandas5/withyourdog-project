import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/LoginRegisterModal';
import Places from './pages/explore/places/Places';
import Services from './pages/explore/services/Services';
import NotFound from './pages/NotFound';

function AppContent() {
  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate('/'); // arba navigate(-1) jei nori grįžti atgal
  };

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login mode="login" onClose={handleCloseModal} />}
          />
          <Route
            path="/register"
            element={<Login mode="register" onClose={handleCloseModal} />}
          />
          <Route path="/places" element={<Places />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

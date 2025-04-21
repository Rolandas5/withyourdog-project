import { useState, useEffect, useContext } from 'react';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import './login-register-modal.css';
import { AuthContext } from '../../../context/AuthContext';

interface LoginRegisterModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

export default function LoginRegisterModal({
  mode,
  onClose,
}: LoginRegisterModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, login, error, isLoading, isAuthenticated } =
    useContext(AuthContext);

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(username, email, password);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{isLogin ? 'Prisijungti' : 'Registracija'}</h2>

        {isLoading && <p className="loading-message">Įkeliama...</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={`input-group ${username ? 'active' : ''}`}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Vartotojo vardas</label>
              <IoPersonOutline className="input-icon" />
            </div>
          )}

          <div className={`input-group ${email ? 'active' : ''}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>El. paštas</label>
            <IoMailOutline className="input-icon" />
          </div>

          <div className={`input-group ${password ? 'active' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Slaptažodis</label>
            <IoLockClosedOutline className="input-icon" />
          </div>

          {isLogin && (
            <label
              className="remember-me"
              style={{ color: '#000', marginTop: '-12px' }}
            >
              <input type="checkbox" /> Prisiminti mane
            </label>
          )}

          <button type="submit">
            {isLogin ? 'Prisijungti' : 'Registruotis'}
          </button>

          <p className="form-switch">
            {isLogin ? (
              <>
                Neturite paskyros?{' '}
                <span onClick={handleSwitch}>Registruotis</span>
              </>
            ) : (
              <>
                Jau turite paskyrą?{' '}
                <span onClick={handleSwitch}>Prisijungti</span>
              </>
            )}
          </p>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

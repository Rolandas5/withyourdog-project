import { useState, useEffect, useContext } from 'react';
import { FiMail, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{
    username?: string;
    email?: string;
    passwordMatch?: string;
  }>({});

  const { register, login, error, isLoading, isAuthenticated, clearError } =
    useContext(AuthContext);

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessages({});
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errorMessages = {};

    if (!isLogin && !username.trim())
      newErrors.username = 'Įveskite vartotojo vardą';
    if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
    if (!isLogin && password !== confirmPassword)
      newErrors.passwordMatch = 'Slaptažodžiai nesutampa';

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    setErrorMessages({});

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
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
              />
              <label>Vartotojo vardas</label>
              <FiUser className="input-icon" />
              {errorMessages.username && (
                <p className="error-message">{errorMessages.username}</p>
              )}
            </div>
          )}

          <div className={`input-group ${email ? 'active' : ''}`}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
            />
            <label>El. paštas</label>
            <FiMail className="input-icon" />
            {errorMessages.email && (
              <p className="error-message">{errorMessages.email}</p>
            )}
          </div>

          <div className={`input-group ${password ? 'active' : ''}`}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
            />
            <label>Slaptažodis</label>
            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {!isLogin && (
            <div className={`input-group ${confirmPassword ? 'active' : ''}`}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
              />
              <label>Pakartokite slaptažodį</label>
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              {errorMessages.passwordMatch && (
                <p className="error-message">{errorMessages.passwordMatch}</p>
              )}
            </div>
          )}

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

          <div className="auth-footer">
            {isLogin ? (
              <p>
                Neturite paskyros? <a onClick={handleSwitch}>Registruotis</a>
              </p>
            ) : (
              <p>
                Jau turite paskyrą? <a onClick={handleSwitch}>Prisijungti</a>
              </p>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

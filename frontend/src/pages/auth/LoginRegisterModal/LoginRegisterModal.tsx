import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { register, login, error, isLoading, clearError } =
    useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong' | null
  >(null);
  const [errorMessages, setErrorMessages] = useState<{
    username?: string;
    email?: string;
    password?: string;
    passwordMatch?: string;
  }>({});

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLogin(mode === 'login');
    clearError();
    setErrorMessages({});
  }, [mode]);

  useEffect(() => {
    if (isLogin) {
      emailRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [isLogin]);

  const isValidEmail = (value: string) => /.+@.+\..+/.test(value);
  const evaluatePasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return 'weak';
    if (/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(pwd)) return 'strong';
    return 'medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validacija
    const newErrors: typeof errorMessages = {};
    if (!isLogin) {
      if (!username.trim()) newErrors.username = 'Įveskite vartotojo vardą';
      if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
      else if (!isValidEmail(email))
        newErrors.email = 'Neteisingas el. pašto formatas';
      if (!password) newErrors.password = 'Įveskite slaptažodį';
      if (!confirmPassword) newErrors.passwordMatch = 'Pakartokite slaptažodį';
      if (password && confirmPassword && password !== confirmPassword)
        newErrors.passwordMatch = 'Slaptažodžiai nesutampa';
    } else {
      if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
      else if (!isValidEmail(email))
        newErrors.email = 'Neteisingas el. pašto formatas';
      if (!password) newErrors.password = 'Įveskite slaptažodį';
    }

    setErrorMessages(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // API kvietimas
    let ok = false;
    if (isLogin) {
      ok = await login(email, password);
    } else {
      ok = await register(username, email, password);
    }

    if (ok) {
      onClose(); // uždarom modalą
      navigate('/dashboard'); // einam į dashboard
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

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className={`input-group ${username ? 'active' : ''}`}>
              <div className="text-input-wrapper">
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.replace(/@/g, ''));
                    clearError();
                  }}
                  aria-label="Vartotojo vardas"
                  autoComplete="new-username"
                  required
                />
                <FiUser className="input-icon" />
              </div>
              <label htmlFor="username">Vartotojo vardas</label>
              {errorMessages.username && (
                <p className="error-message">{errorMessages.username}</p>
              )}
            </div>
          )}

          <div className={`input-group ${email ? 'active' : ''}`}>
            <div className="text-input-wrapper">
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                aria-label="El. paštas"
                autoComplete="email"
                required
              />
              <FiMail className="input-icon" />
            </div>
            <label htmlFor="email">El. paštas</label>
            {errorMessages.email && (
              <p className="error-message">{errorMessages.email}</p>
            )}
          </div>

          <div className={`input-group ${password ? 'active' : ''}`}>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  if (!isLogin)
                    setPasswordStrength(evaluatePasswordStrength(val));
                  clearError();
                }}
                aria-label="Slaptažodis"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                role="button"
                tabIndex={0}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <label htmlFor="password">Slaptažodis</label>
            {!isLogin && password && (
              <div
                className={`password-strength ${passwordStrength}`}
                aria-live="polite"
              >
                {passwordStrength === 'weak' && 'Silpnas slaptažodis'}
                {passwordStrength === 'medium' &&
                  'Vidutinio stiprumo slaptažodis'}
                {passwordStrength === 'strong' && 'Stiprus slaptažodis'}
              </div>
            )}
            {errorMessages.password && (
              <p className="error-message">{errorMessages.password}</p>
            )}
          </div>

          {!isLogin && (
            <div className={`input-group ${confirmPassword ? 'active' : ''}`}>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError();
                  }}
                  aria-label="Pakartoti slaptažodį"
                  autoComplete="new-password"
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  role="button"
                  tabIndex={0}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <label htmlFor="confirmPassword">Pakartoti slaptažodį</label>
              {errorMessages.passwordMatch && (
                <p className="error-message">{errorMessages.passwordMatch}</p>
              )}
            </div>
          )}

          {isLogin && (
            <label className="remember-me">
              <input type="checkbox" /> Prisiminti mane
            </label>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Siunčiama...'
              : isLogin
              ? 'Prisijungti'
              : 'Registruotis'}
          </button>

          <div className="auth-footer">
            {isLogin ? (
              <p>
                Neturite paskyros?{' '}
                <a onClick={() => setIsLogin(false)}>Registruotis</a>
              </p>
            ) : (
              <p>
                Jau turite paskyrą?{' '}
                <a onClick={() => setIsLogin(true)}>Prisijungti</a>
              </p>
            )}
          </div>

          {error && !Object.keys(errorMessages).length && (
            <p className="error-message" role="alert" aria-live="polite">
              {error}
            </p>
          )}
        </form>

        <div className="modal-footer-note">
          © 2025
          <br />
          <strong>WithYourDog</strong>
        </div>
      </div>
    </div>
  );
}

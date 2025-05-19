import { useState, useEffect, useContext, useRef } from 'react';
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

  const { register, login, error, isLoading, isAuthenticated, clearError } =
    useContext(AuthContext);

  useEffect(() => {
    setIsLogin(mode === 'login');
    clearError();
    setErrorMessages({});
  }, [mode]);

  // Focus logic – kai tik atsiranda modalas, focus į pirmą laukelį pagal režimą
  useEffect(() => {
    if (isLogin) {
      emailRef.current?.focus();
    } else {
      usernameRef.current?.focus();
    }
  }, [isLogin]);

  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) return 'weak';
    if (/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) return 'strong';
    return 'medium';
  };

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessages({});
    setPasswordStrength(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errorMessages = {};

    // REGISTRACIJA
    if (!isLogin) {
      if (!username.trim()) newErrors.username = 'Įveskite vartotojo vardą';

      if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
      else if (!isValidEmail(email))
        newErrors.email = 'Neteisingas el. pašto formatas';

      if (!password) newErrors.password = 'Įveskite slaptažodį';
      if (!confirmPassword) newErrors.passwordMatch = 'Pakartokite slaptažodį';

      // Tik jeigu abu įvesti, bet nesutampa – rodoma šita žinutė
      if (password && confirmPassword && password !== confirmPassword) {
        newErrors.passwordMatch = 'Slaptažodžiai nesutampa';
      }
    }
    // LOGIN
    else {
      if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
      else if (!isValidEmail(email))
        newErrors.email = 'Neteisingas el. pašto formatas';
      if (!password) newErrors.password = 'Įveskite slaptažodį';
    }

    setErrorMessages(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setErrorMessages({});
    clearError();

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
                  onKeyDown={(e) => {
                    if (e.key === '@') e.preventDefault();
                  }}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/@/g, '');
                    setUsername(clean);
                    clearError();
                  }}
                  aria-label="Vartotojo vardas"
                  aria-required={!isLogin}
                  required={!isLogin}
                  autoComplete="new-username"
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
                required
                autoComplete="email"
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
                  // Tik registracijos metu stiprumas
                  if (!isLogin)
                    setPasswordStrength(evaluatePasswordStrength(val));
                  clearError();
                }}
                aria-label="Slaptažodis"
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
                aria-label={
                  showPassword ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'
                }
                role="button"
              >
                {showPassword ? (
                  <FiEyeOff aria-hidden="true" />
                ) : (
                  <FiEye aria-hidden="true" />
                )}
              </span>
            </div>
            <label htmlFor="password">Slaptažodis</label>
            {/* RODOM tik REGISTRACIJOJE! */}
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
            {errorMessages.password && !password && (
              <p className="error-message">{errorMessages.password}</p>
            )}
          </div>

          {/* Pakartotinas slaptažodis – TIK REGISTRACIJOJE */}
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
                  aria-required={!isLogin}
                  required={!isLogin}
                  autoComplete="new-password"
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={0}
                  aria-label={
                    showConfirmPassword
                      ? 'Slėpti slaptažodį'
                      : 'Rodyti slaptažodį'
                  }
                  role="button"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff aria-hidden="true" />
                  ) : (
                    <FiEye aria-hidden="true" />
                  )}
                </span>
              </div>
              <label htmlFor="confirmPassword">Pakartoti slaptažodį</label>
              {/* INDICATORIUS AR SUTAMPA */}
              {password && confirmPassword && password !== confirmPassword && (
                <div className="password-strength weak">
                  Slaptažodžiai nesutampa
                </div>
              )}
              {errorMessages.passwordMatch && !confirmPassword && (
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
                Neturite paskyros? <a onClick={handleSwitch}>Registruotis</a>
              </p>
            ) : (
              <p>
                Jau turite paskyrą? <a onClick={handleSwitch}>Prisijungti</a>
              </p>
            )}
          </div>

          {error && !Object.keys(errorMessages).length && (
            <p className="error-message" role="alert" aria-live="polite">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

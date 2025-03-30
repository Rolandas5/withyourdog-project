import { useState, useEffect } from 'react';
import '../../css/LoginRegisterModal.css';

interface LoginRegisterModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

export default function LoginRegisterModal({
  mode,
  onClose,
}: LoginRegisterModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, []); // Tik pradiniam užstatymui

  const handleSwitch = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{isLogin ? 'Prisijungti' : 'Registracija'}</h2>

        <form className="auth-form">
          {!isLogin && (
            <input type="text" placeholder="Vartotojo vardas" required />
          )}
          <input type="email" placeholder="El. paštas" required />
          <input type="password" placeholder="Slaptažodis" required />

          {isLogin && (
            <label className="remember-me">
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
        </form>
      </div>
    </div>
  );
}

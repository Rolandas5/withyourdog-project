import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './dashboard.css';

type Tab =
  | 'profile'
  | 'places'
  | 'experiences'
  | 'reviews'
  | 'messages'
  | 'users';

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [role, setRole] = useState(user?.role || 'user');
  const navigate = useNavigate();

  const changeRole = () => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    setRole(newRole);
  };

  useEffect(() => {
    if (user === null) navigate('/');
  }, [user, navigate]);

  if (user === undefined) return <div>Kraunama...</div>;

  // --- ČIA UI LOGIKA PAGAL ROLE ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span className="welcome-text">
          👋 Labas, {user?.name || 'drauge'}! Smagu, kad sugrįžai.
        </span>
        <button className="logout-button" onClick={logout}>
          Atsijungti
        </button>
        <button className="change-role-button" onClick={changeRole}>
          Pakeisti rolę ({role})
        </button>
      </div>
      <div className="tabs">
        {user.role === 'admin' ? (
          <>
            <button
              className={`tab-button ${
                activeTab === 'profile' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Šuniukų profiliai
            </button>
            <button
              className={`tab-button ${activeTab === 'places' ? 'active' : ''}`}
              onClick={() => setActiveTab('places')}
            >
              Vietos
            </button>
            <button
              className={`tab-button ${
                activeTab === 'experiences' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('experiences')}
            >
              Patirtys
            </button>
            <button
              className={`tab-button ${
                activeTab === 'reviews' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Atsiliepimai
            </button>
            <button
              className={`tab-button ${
                activeTab === 'messages' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('messages')}
            >
              Žinutės
            </button>
            <button
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Vartotojai
            </button>
          </>
        ) : (
          <>
            <button
              className={`tab-button ${
                activeTab === 'profile' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Mano profilis
            </button>
            <button
              className={`tab-button ${
                activeTab === 'experiences' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('experiences')}
            >
              Mano patirtys
            </button>
            <button
              className={`tab-button ${
                activeTab === 'reviews' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Mano atsiliepimai
            </button>
            {/* Jei reikia, pridėk kitas paprastam vartotojui skirtas skiltis */}
          </>
        )}
      </div>
      <div className="dashboard-content">{/* čia turinys pagal tab */}</div>
    </div>
  );
};

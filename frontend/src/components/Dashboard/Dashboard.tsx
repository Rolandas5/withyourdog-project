import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './dashboard.css';

type Tab =
  | 'user'
  | 'admin-places'
  | 'admin-experiences'
  | 'admin-reviews'
  | 'admin-messages'
  | 'admin-users';

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('user');
  const navigate = useNavigate();

  useEffect(() => {
    // Jei user ištrintas arba neprisijungęs – grąžina į pradžią
    if (user === null) navigate('/');
  }, [user, navigate]);

  if (user === undefined) return <div>Kraunama...</div>;
  if (user === null) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span className="welcome-text">
          👋 Labas, {user?.name || 'drauge'}! Smagu, kad sugrįžai.
        </span>
        <button className="logout-button" onClick={logout}>
          Atsijungti
        </button>
      </div>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          Mano profilis
        </button>
        {isAdmin && (
          <>
            <button
              className={`tab-button ${
                activeTab === 'admin-places' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('admin-places')}
            >
              Vietos
            </button>
            <button
              className={`tab-button ${
                activeTab === 'admin-experiences' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('admin-experiences')}
            >
              Patirtys
            </button>
            <button
              className={`tab-button ${
                activeTab === 'admin-reviews' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('admin-reviews')}
            >
              Atsiliepimai
            </button>
            <button
              className={`tab-button ${
                activeTab === 'admin-messages' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('admin-messages')}
            >
              Žinutės
            </button>
            <button
              className={`tab-button ${
                activeTab === 'admin-users' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('admin-users')}
            >
              Vartotojai
            </button>
          </>
        )}
      </div>
      <div className="dashboard-content">
        {/* Čia atvaizduosi turinį pagal aktyvų tab'ą */}
        {/* Pvz.: {activeTab === 'user' && <UserProfileTab />} */}
      </div>
    </div>
  );
};

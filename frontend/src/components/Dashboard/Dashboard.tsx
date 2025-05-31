import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UserProfileTab } from './components/UserProfileTab/UserProfileTab';
import axios from 'axios';
import { API_URL } from '../../constants/global';

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('user');
  const [dogProfile, setDogProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Užkrauk šuns profilį pagal userId
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get(`${API_URL}/dog-profile/user/${user._id}`)
      .then((res) => {
        setDogProfile(res.data || {});
        setLoading(false);
      })
      .catch(() => {
        setDogProfile({});
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (user === null) navigate('/');
  }, [user, navigate]);

  if (user === undefined) return <div>Kraunama...</div>;
  if (user === null) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="dashboard-container">
      {/* ... tabs, header */}
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
        {/* ...admin tab'ai */}
      </div>
      <div className="dashboard-content">
        {activeTab === 'user' &&
          (loading ? (
            <div>Kraunama...</div>
          ) : (
            <UserProfileTab
              dog={{
                ...dogProfile,
                userId: user._id,
              }}
              onProfileSaved={setDogProfile}
            />
          ))}
        {/* Kiti tab'ai */}
      </div>
    </div>
  );
};

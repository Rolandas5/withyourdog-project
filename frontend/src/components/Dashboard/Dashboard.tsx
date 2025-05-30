import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../constants/global';
import './dashboard.css';

type Tab =
  | 'profile'
  | 'places'
  | 'experiences'
  | 'reviews'
  | 'messages'
  | 'users';

export const Dashboard = () => {
  const { user, setUser, access_token, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Funkcija, kuri keičia rolę tik prisijungusiam user'iui
  const handleRoleChange = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Nauja rolė
      const newRole = user.role === 'admin' ? 'user' : 'admin';

      // Siunčiam į backend'ą pakeisti rolę
      await axios.put(
        `${API_URL}/auth/update-role/${user._id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      // Po pakeitimo paimam naują user info iš serverio
      const res = await axios.get(`${API_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setUser(res.data); // atnaujinam context
    } catch (err) {
      alert('Nepavyko pakeisti rolės');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Jei user ištrintas arba neprisijungęs – grąžinam į pradžią
    if (user === null) navigate('/');
  }, [user, navigate]);

  if (user === undefined) return <div>Kraunama...</div>;
  if (user === null) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <span className="welcome-text">
          👋 Labas, {user?.name || 'drauge'}! Smagu, kad sugrįžai.
        </span>
        <button className="logout-button" onClick={logout}>
          Atsijungti
        </button>
        <button
          className="change-role-button"
          onClick={handleRoleChange}
          disabled={loading}
        >
          {loading ? 'Keičiu...' : `Pakeisti rolę (${user.role})`}
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
          </>
        )}
      </div>
      <div className="dashboard-content">
        {/* Čia atvaizduosi turinį pagal aktyvų tab'ą */}
        {/* Pvz.: {activeTab === 'profile' && <ProfileTab />} */}
      </div>
    </div>
  );
};

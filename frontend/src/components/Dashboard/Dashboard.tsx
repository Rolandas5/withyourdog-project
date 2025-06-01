import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UserProfileTab } from './components/UserProfileTab/UserProfileTab';
import axios from 'axios';
import { API_URL } from '../../constants/global';
import './dashboard.css';
import './user-dogs-table.css';
import { UserDogsTable, DogProfile } from './UserDogsTable';
import { EditDogModal } from './EditDogModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import WeatherBlock from '../WeatherBlock/WeatherBlock';

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('user');
  const [dogProfile, setDogProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [editDog, setEditDog] = useState<DogProfile | null>(null);
  const [addForm, setAddForm] = useState({
    name: '',
    breed: '',
    hobbies: '',
    favoritePlaces: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteDog, setDeleteDog] = useState<DogProfile | null>(null);
  const navigate = useNavigate();

  // Užkrauk šuns profilį pagal userId
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get(`${API_URL}/dog-profile/user/${user._id}`)
      .then((res) => {
        setDogProfile(res.data || {});
        setDogs(
          Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
        );
        setLoading(false);
      })
      .catch(() => {
        setDogProfile({});
        setDogs([]);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (user === null && !loading) navigate('/');
  }, [user, loading, navigate]);

  if (user === undefined) return <div>Kraunama...</div>;
  if (user === null) return null;

  const isAdmin = user.role === 'admin';

  // Pridėti naują šuniuką
  const handleAddDog = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/dog-profile`, {
        name: addForm.name,
        breed: addForm.breed,
        hobbies: addForm.hobbies.split(',').map((h) => h.trim()),
        favoritePlaces: addForm.favoritePlaces.split(',').map((p) => p.trim()),
        avatarUrl: addForm.avatarUrl,
        userId: user._id,
      });
      setDogs((prev) => [...prev, res.data]);
      setAddForm({
        name: '',
        breed: '',
        hobbies: '',
        favoritePlaces: '',
        avatarUrl: '',
      });
    } catch {
      alert('Nepavyko pridėti šuniuko.');
    }
    setSaving(false);
  };

  // Redaguoti šuniuką
  const handleEditDog = async (updatedDog: Partial<DogProfile>) => {
    try {
      const res = await axios.patch(
        `${API_URL}/dog-profile/${updatedDog._id}`,
        updatedDog
      );
      setDogs((prev) =>
        prev.map((d) => (d._id === updatedDog._id ? res.data : d))
      );
      setEditDog(null);
    } catch {
      alert('Nepavyko atnaujinti šuniuko.');
    }
  };

  // Ištrinti šuniuką
  const handleDeleteDog = (dogId: string) => {
    const dog = dogs.find((d) => d._id === dogId) || null;
    setDeleteDog(dog);
  };

  const confirmDeleteDog = async () => {
    if (!deleteDog) return;
    try {
      await axios.delete(`${API_URL}/dog-profile/${deleteDog._id}`);
      setDogs((prev) => prev.filter((d) => d._id !== deleteDog._id));
      setDeleteDog(null);
    } catch {
      alert('Nepavyko ištrinti šuniuko.');
      setDeleteDog(null);
    }
  };

  return (
    <div className="dashboard-container">
      <div
        className="dashboard-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          padding: '18px 0 12px 0',
        }}
      >
        <span className="welcome-text">
          👋 Labas, {user?.name || 'drauge'}! Smagu, kad sugrįžai.
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 140,
            margin: '0 18px',
            padding: '2px 0',
          }}
        >
          <WeatherBlock />
        </div>
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
        <button
          className={`tab-button ${activeTab === 'places' ? 'active' : ''}`}
          onClick={() => setActiveTab('places')}
        >
          Vietos
        </button>
        {isAdmin && (
          <>
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
        {loading ? (
          <div>Kraunama...</div>
        ) : (
          <>
            {activeTab === 'user' && (
              <>
                <UserDogsTable
                  dogs={dogs}
                  onEdit={setEditDog}
                  onDelete={handleDeleteDog}
                />
                <UserProfileTab
                  dog={{
                    ...dogProfile,
                    userId: user._id,
                  }}
                  onProfileSaved={(savedDog) => {
                    setDogProfile(savedDog);
                    setDogs((prev) => {
                      if (
                        !savedDog._id ||
                        !prev.find((d) => d._id === savedDog._id)
                      ) {
                        // Pridėti naują
                        return [...prev, savedDog];
                      } else {
                        // Atnaujinti esamą
                        return prev.map((d) =>
                          d._id === savedDog._id ? savedDog : d
                        );
                      }
                    });
                  }}
                />
              </>
            )}
            {/* Kiti tab'ai */}
            {activeTab === 'places' && <div>Žinomas tabas</div>}
            {activeTab === 'admin-experiences' && <div>Žinomas tabas</div>}
            {activeTab === 'admin-reviews' && <div>Žinomas tabas</div>}
            {activeTab === 'admin-messages' && <div>Žinomas tabas</div>}
            {activeTab === 'admin-users' && <div>Žinomas tabas</div>}
            {/* Modalai */}
            {editDog && (
              <EditDogModal
                dog={editDog}
                onSave={handleEditDog}
                onClose={() => setEditDog(null)}
              />
            )}
            {deleteDog && (
              <DeleteConfirmModal
                dogName={deleteDog.name}
                onConfirm={confirmDeleteDog}
                onCancel={() => setDeleteDog(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

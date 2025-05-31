import './user-profile-tab.css';
import { useState } from 'react';
import { API_URL } from '../../../../constants/global';
import { DogAvatarUploader } from './DogAvatarUploader/DogAvatarUploader';
import axios from 'axios';

interface UserProfileTabProps {
  dog: {
    avatarUrl?: string;
    name: string;
    breed: string;
    hobbies: string[];
    favoritePlaces: string[];
    _id?: string; // MongoDB ID
    userId?: string;
  };
  onProfileSaved?: (dog: any) => void;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  dog,
  onProfileSaved,
}) => {
  // Local state
  const [avatarUrl, setAvatarUrl] = useState(dog.avatarUrl || '');
  const [name, setName] = useState(dog.name || '');
  const [breed, setBreed] = useState(dog.breed || '');
  const [hobbies, setHobbies] = useState(dog.hobbies?.join(', ') || '');
  const [favoritePlaces, setFavoritePlaces] = useState(
    dog.favoritePlaces?.join(', ') || ''
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Teisingai sudedam avatar kelią
  let imgSrc = '';
  if (avatarUrl) {
    if (avatarUrl.startsWith('http')) {
      imgSrc = avatarUrl;
    } else if (avatarUrl.startsWith('/uploads/')) {
      imgSrc = `${API_URL}${avatarUrl}`;
    } else {
      imgSrc = `${API_URL}/uploads/${avatarUrl}`;
    }
  }

  // PATCH arba POST išsaugojimui
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (dog._id) {
        response = await axios.patch(`${API_URL}/dog-profile/${dog._id}`, {
          avatarUrl,
          name,
          breed,
          hobbies: hobbies.split(',').map((h) => h.trim()),
          favoritePlaces: favoritePlaces.split(',').map((p) => p.trim()),
        });
      } else {
        response = await axios.post(`${API_URL}/dog-profile`, {
          avatarUrl,
          name,
          breed,
          hobbies: hobbies.split(',').map((h) => h.trim()),
          favoritePlaces: favoritePlaces.split(',').map((p) => p.trim()),
          userId: dog.userId,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      if (onProfileSaved && response?.data) onProfileSaved(response.data);
    } catch (err) {
      alert('Nepavyko išsaugoti. Patikrink duomenis arba bandyk vėliau.');
    }
    setSaving(false);
  };

  return (
    <div className="user-profile-tab">
      <h2>Šuniuko profilis</h2>
      <form className="dog-profile-card" onSubmit={handleSave}>
        <div className="avatar-wrapper">
          {imgSrc ? (
            <img className="dog-avatar" src={imgSrc} alt="Šuniuko nuotrauka" />
          ) : (
            <div className="dog-avatar placeholder">🐶</div>
          )}
          <DogAvatarUploader avatarUrl={avatarUrl} onUpload={setAvatarUrl} />
        </div>
        {/* Laukeliai */}
        <div className="dog-info-form">
          <label>
            Vardas:
            <input
              type="text"
              value={name}
              className="profile-input"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Veislė:
            <input
              type="text"
              value={breed}
              className="profile-input"
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </label>
          <label>
            Pomėgiai:
            <input
              type="text"
              value={hobbies}
              className="profile-input"
              onChange={(e) => setHobbies(e.target.value)}
              placeholder="pvz.: Bėgioti, Žaisti su kamuoliuku"
            />
          </label>
          <label>
            Mėgstamos vietos:
            <input
              type="text"
              value={favoritePlaces}
              className="profile-input"
              onChange={(e) => setFavoritePlaces(e.target.value)}
              placeholder="pvz.: Vingio parkas, Kaimo pieva"
            />
          </label>
        </div>
        <button type="submit" className="profile-save-btn" disabled={saving}>
          {saving ? 'Išsaugoma...' : 'Išsaugoti'}
        </button>
        {saved && <div className="profile-saved">Išsaugota!</div>}
      </form>
    </div>
  );
};

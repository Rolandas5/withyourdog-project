import React, { useState } from 'react';
import { DogProfile } from './UserDogsTable';
import { DogAvatarUploader } from './components/UserProfileTab/DogAvatarUploader/DogAvatarUploader';
import { API_URL } from '../../constants/global';

interface EditDogModalProps {
  dog: DogProfile;
  onSave: (updatedDog: Partial<DogProfile>) => void;
  onClose: () => void;
}

export const EditDogModal: React.FC<EditDogModalProps> = ({
  dog,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(dog.name);
  const [breed, setBreed] = useState(dog.breed);
  const [hobbies, setHobbies] = useState(dog.hobbies.join(', '));
  const [favoritePlaces, setFavoritePlaces] = useState(
    dog.favoritePlaces.join(', ')
  );
  const [avatarUrl, setAvatarUrl] = useState(dog.avatarUrl || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  let imgSrc = '';
  if (avatarPreview) {
    imgSrc = avatarPreview;
  } else if (avatarUrl) {
    if (avatarUrl.startsWith('http')) {
      imgSrc = avatarUrl;
    } else if (avatarUrl.startsWith('/uploads/')) {
      imgSrc = `${API_URL.replace(/\/api$/, '')}${avatarUrl}`;
    } else {
      imgSrc = `${API_URL.replace(/\/api$/, '')}/uploads/${avatarUrl}`;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      _id: dog._id,
      name,
      breed,
      hobbies: hobbies.split(',').map((h) => h.trim()),
      favoritePlaces: favoritePlaces.split(',').map((p) => p.trim()),
      avatarUrl,
    });
  };

  return (
    <div className="dashboard-modal-overlay">
      <div className="dashboard-modal-card">
        <button className="dashboard-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Redaguoti šuniuką</h2>
        <form onSubmit={handleSubmit} className="edit-dog-form">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {imgSrc ? (
              <img
                className="dog-avatar"
                src={imgSrc}
                alt="Šuniuko nuotrauka"
                style={{ marginBottom: 6 }}
              />
            ) : (
              <div className="dog-avatar placeholder">🐶</div>
            )}
            <DogAvatarUploader
              avatarUrl={avatarUrl}
              onUpload={setAvatarUrl}
              onPreview={setAvatarPreview}
            />
          </div>
          <label>
            Vardas:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Veislė:
            <input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </label>
          <label>
            Pomėgiai:
            <input
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
            />
          </label>
          <label>
            Mėgstamos vietos:
            <input
              value={favoritePlaces}
              onChange={(e) => setFavoritePlaces(e.target.value)}
            />
          </label>
          <button type="submit" className="profile-save-btn">
            Išsaugoti
          </button>
        </form>
      </div>
    </div>
  );
};

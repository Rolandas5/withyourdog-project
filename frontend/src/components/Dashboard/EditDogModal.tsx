import React, { useState } from 'react';
import { DogProfile } from './UserDogsTable';

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
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Redaguoti šuniuką</h2>
        <form onSubmit={handleSubmit} className="edit-dog-form">
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
          {/* Galima pridėti avataro upload'ą */}
          <button type="submit" className="profile-save-btn">
            Išsaugoti
          </button>
        </form>
      </div>
    </div>
  );
};

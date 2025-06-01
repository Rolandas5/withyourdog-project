import React from 'react';
import { API_URL } from '../../constants/global';

const BASE_URL = API_URL.replace(/\/api$/, '');

export interface DogProfile {
  _id: string;
  avatarUrl?: string;
  name: string;
  breed: string;
  hobbies: string[];
  favoritePlaces: string[];
}

interface UserDogsTableProps {
  dogs: DogProfile[];
  onEdit: (dog: DogProfile) => void;
  onDelete: (dogId: string) => void;
}

export const UserDogsTable: React.FC<UserDogsTableProps> = ({
  dogs,
  onEdit,
  onDelete,
}) => {
  if (!dogs.length) {
    return <div className="no-dogs-msg">Dar nėra šuniuko profilio</div>;
  }
  return (
    <div className="dogs-table-wrapper">
      <table className="dogs-table">
        <thead>
          <tr>
            <th>Nuotrauka</th>
            <th>Vardas</th>
            <th>Veislė</th>
            <th>Pomėgiai</th>
            <th>Mėgstamos vietos</th>
            <th>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog) => (
            <tr key={dog._id}>
              <td>
                {dog.avatarUrl ? (
                  <img
                    src={
                      dog.avatarUrl.startsWith('http')
                        ? dog.avatarUrl
                        : dog.avatarUrl.startsWith('/uploads/')
                        ? `${BASE_URL}${dog.avatarUrl}`
                        : `${API_URL}/uploads/${dog.avatarUrl}`
                    }
                    alt={dog.name}
                    className="dog-table-avatar"
                  />
                ) : (
                  <span className="dog-table-avatar placeholder">🐶</span>
                )}
              </td>
              <td>{dog.name}</td>
              <td>{dog.breed}</td>
              <td>{dog.hobbies.join(', ')}</td>
              <td>{dog.favoritePlaces.join(', ')}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(dog)}>
                  Redaguoti
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(dog._id)}
                >
                  Ištrinti
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

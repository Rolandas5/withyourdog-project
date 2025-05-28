import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../constants/global';
import { AuthContext } from '../../../context/AuthContext';
import { User } from '../../../types/typesUser';

export const AdminUsersTab = () => {
  const { access_token } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  // Parsisiunčia visus vartotojus
  const fetchAllUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
      };
      const response = await axios.get<User[]>(
        `${API_URL}/auth/all-users`,
        config
      );
      setAllUsers(response.data);
      setLoading(false);
    } catch (error) {
      setAlert('Nepavyko gauti vartotojų sąrašo!');
      setLoading(false);
    }
  };

  // Keičia vartotojo rolę
  const updateUserRole = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
      };
      await axios.put(
        `${API_URL}/auth/update-role/${selectedUser._id}`,
        { role: newRole },
        config
      );
      setAlert(
        `Vartotojo "${selectedUser.name}" rolė pakeista į "${newRole}"!`
      );
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchAllUsers();
    } catch (error) {
      setAlert('Nepavyko pakeisti vartotojo rolės!');
    }
  };

  // Atidaro modalą rolės redagavimui
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchAllUsers();
  }, [access_token]);

  return (
    <div className="admin-tab">
      <h2>Vartotojai</h2>

      {alert && (
        <div className="alert-info">
          {alert}
          <button
            onClick={() => setAlert(null)}
            style={{
              marginLeft: '12px',
              background: 'transparent',
              border: 'none',
              color: '#d00',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      )}

      {loading ? (
        <p>Kraunama vartotojų sąrašą...</p>
      ) : allUsers.length === 0 ? (
        <p>Nerasta nė vieno vartotojo.</p>
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Vardas</th>
              <th>El. paštas</th>
              <th>Rolė</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(user)}>
                    Keisti rolę
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && selectedUser && (
        <UserUpdateModal
          onModalClose={() => setIsModalOpen(false)}
          onSubmit={(formData) => updateUserRole(formData.role)}
          editUser={selectedUser}
        />
      )}
    </div>
  );
};

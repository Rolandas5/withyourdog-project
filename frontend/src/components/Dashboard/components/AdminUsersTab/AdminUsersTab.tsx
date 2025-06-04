import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../constants/global';
import { AuthContext } from '../../../../context/AuthContext';
import { User } from '../../../../types/typesUser';
import './admin-users-tab.css';
import { DeleteUserModal } from './DeleteUserModal';

export const AdminUsersTab = () => {
  const { access_token } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

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

  // Ištrina vartotoją
  const handleDelete = async (userId: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${access_token}` },
      };
      await axios.delete(`${API_URL}/auth/delete-user/${userId}`, config);
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      setAlert('Vartotojas ištrintas.');
    } catch {
      setAlert('Nepavyko ištrinti vartotojo!');
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
    <div className="admin-users-tab">
      <h2 className="users-title">Vartotojai</h2>
      {alert && <div className="alert-msg">{alert}</div>}
      {loading ? (
        <p>Kraunama...</p>
      ) : allUsers.length === 0 ? (
        <p>Dar nėra vartotojų.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Vardas</th>
              <th>El. paštas</th>
              <th>Rolė</th>
              <th>Registracijos data</th>
              <th>IP adresas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      setSelectedUser(user);
                      updateUserRole(e.target.value);
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : '-'}
                </td>
                <td>{user.ipAddress || '-'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => setDeleteUser(user)}
                  >
                    Ištrinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteUser && (
        <DeleteUserModal
          userName={deleteUser.name}
          onConfirm={async () => {
            await handleDelete(deleteUser._id!);
            setDeleteUser(null);
          }}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
};

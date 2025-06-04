import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../constants/global';
import { Message } from '../../../../types/typesMessage';
import { AuthContext } from '../../../../context/AuthContext';
import './admin-messages-tab.css';
import { DeleteMessageModal } from './DeleteMessageModal';

export const MessagesTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useContext(AuthContext);
  const [deleteMsg, setDeleteMsg] = useState<Message | null>(null);

  useEffect(() => {
    if (!access_token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    axios
      .get(`${API_URL}/messages/all`, config)
      .then((res) => setMessages(res.data))
      .catch(() => alert('Nepavyko gauti žinučių'))
      .finally(() => setLoading(false));
  }, [access_token]);

  const handleDelete = async (id: string) => {
    const msg = messages.find((m) => m._id === id) || null;
    setDeleteMsg(msg);
  };

  const confirmDelete = async () => {
    if (!deleteMsg) return;
    try {
      await axios.delete(`${API_URL}/messages/${deleteMsg._id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== deleteMsg._id));
      setDeleteMsg(null);
    } catch {
      alert('Nepavyko ištrinti žinutės');
      setDeleteMsg(null);
    }
  };

  return (
    <div className="admin-messages-tab">
      <h2 className="messages-title">Žinutės</h2>
      {loading ? (
        <p>Kraunama...</p>
      ) : messages.length === 0 ? (
        <p>Dar nėra žinučių.</p>
      ) : (
        <table className="messages-table">
          <thead>
            <tr>
              <th>Vardas</th>
              <th>El. paštas</th>
              <th>Žinutė</th>
              <th>Data</th>
              <th>IP adresas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.text}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td>{msg.ipAddress}</td>
                <td>
                  <button onClick={() => handleDelete(msg._id)}>
                    Ištrinti
                  </button>
                  {/* Galima pridėti ir redagavimo mygtuką */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteMsg && (
        <DeleteMessageModal
          message={deleteMsg}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteMsg(null)}
        />
      )}
    </div>
  );
};

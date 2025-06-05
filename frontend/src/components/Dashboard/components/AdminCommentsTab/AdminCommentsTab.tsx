import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../constants/global';
import { Comment } from '../../../../types/typesComment';
import { AuthContext } from '../../../../context/AuthContext';
import './admin-comments-tab.css';

export default function AdminCommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useContext(AuthContext);
  const [deleteComment, setDeleteComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (!access_token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    axios
      .get(`${API_URL}/comments/all`, config)
      .then((res) => setComments(res.data))
      .catch(() => alert('Nepavyko gauti komentarų'))
      .finally(() => setLoading(false));
  }, [access_token]);

  const handleDelete = async (id: string) => {
    const comment = comments.find((c) => c._id === id) || null;
    setDeleteComment(comment);
  };

  const confirmDelete = async () => {
    if (!deleteComment) return;
    try {
      await axios.delete(`${API_URL}/comments/${deleteComment._id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== deleteComment._id));
      setDeleteComment(null);
    } catch {
      alert('Nepavyko ištrinti komentaro');
      setDeleteComment(null);
    }
  };

  return (
    <div className="admin-comments-tab">
      <h2 className="comments-title">Komentarai</h2>
      {loading ? (
        <p>Kraunama...</p>
      ) : comments.length === 0 ? (
        <p>Dar nėra komentarų.</p>
      ) : (
        <table className="comments-table">
          <thead>
            <tr>
              <th>Nuotrauka</th>
              <th>Vartotojas</th>
              <th>Komentaras</th>
              <th>Data</th>
              <th>IP adresas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id}>
                <td>
                  {comment.avatarUrl &&
                  typeof comment.avatarUrl === 'string' &&
                  comment.avatarUrl.trim() !== '' &&
                  comment.avatarUrl !== '/default-dog-avatar.png' ? (
                    <img
                      src={comment.avatarUrl}
                      alt=""
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        background: '#e3eaf2',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'block',
                        marginLeft: 0,
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '2rem',
                        display: 'block',
                        marginLeft: 0,
                      }}
                    >
                      🐶
                    </span>
                  )}
                </td>
                <td>{comment.username}</td>
                <td>{comment.text}</td>
                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                <td>{comment.ipAddress}</td>
                <td>
                  <button onClick={() => handleDelete(comment._id)}>
                    Ištrinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteComment && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal-card">
            <button
              className="dashboard-close-btn"
              onClick={() => setDeleteComment(null)}
            >
              &times;
            </button>
            <h2
              style={{
                color: '#f23d5c',
                marginBottom: 18,
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '0.01em',
              }}
            >
              AR TIKRAI IŠTRINTI?
            </h2>
            <div style={{ fontSize: '1.08rem', marginBottom: 22 }}>
              Ar tikrai norite ištrinti komentarą iš{' '}
              <b>{deleteComment.username}</b>?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
              <button
                type="button"
                className="delete-btn-modal"
                onClick={confirmDelete}
              >
                Taip
              </button>
              <button
                type="button"
                className="cancel-btn-modal"
                onClick={() => setDeleteComment(null)}
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

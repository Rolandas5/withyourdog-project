import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../constants/global';
import { Comment } from '../../../../types/typesComment';
import { AuthContext } from '../../../../context/AuthContext'; // ← PRIDĖTA
import './admin-comments-tab.css';

export default function AdminCommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { access_token } = useContext(AuthContext); // ← PRIDĖTA

  useEffect(() => {
    if (!access_token) return; // ← apsauga nuo null tokeno

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
  }, [access_token]); // ← pridėta į dependencijų masyvą

  return (
    <div className="admin-comments-tab">
      <h2 className="comments-title">Komentarai</h2>
      {loading ? (
        <p>Kraunama...</p>
      ) : comments.length === 0 ? (
        <p>Dar nėra komentarų.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <div className="comment-header">
              <img
                src={comment.avatarUrl || '/default-dog-avatar.png'}
                alt="Šuniuko nuotrauka"
                className="comment-avatar"
              />
              <span className="comment-user">{comment.username}</span>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="comment-text">{comment.text}</div>
            <div className="comment-ip">IP: {comment.ipAddress}</div>
          </div>
        ))
      )}
    </div>
  );
}

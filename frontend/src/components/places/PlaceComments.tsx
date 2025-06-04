import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './place-comments.css';

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  avatarUrl?: string;
}

interface PlaceCommentsProps {
  placeId: string;
  placeType: string;
}

export default function PlaceComments({
  placeId,
  placeType,
}: PlaceCommentsProps) {
  const { user, access_token } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/comments/Hotel/${placeId}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [placeId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !access_token) return;
    setSending(true);
    setError('');
    try {
      const res = await axios.post(
        `/api/comments/`,
        { placeId, placeType, text },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setText('');
    } catch {
      setError('Nepavyko išsiųsti komentaro.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="place-comments-container">
      <h4 className="place-comments-title">Komentarai</h4>
      {loading ? (
        <div className="place-comments-loading">Kraunama...</div>
      ) : comments.length === 0 ? null : (
        <div className="place-comments-list">
          {comments.map((c) => (
            <div key={c._id} className="place-comment-card">
              <div className="place-comment-header">
                <img
                  src={c.avatarUrl || '/default-dog-avatar.png'}
                  alt="Šuniuko nuotrauka"
                  className="place-comment-avatar"
                />
                <div>
                  <div className="place-comment-username">{c.username}</div>
                  <div className="place-comment-date">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="place-comment-text">{c.text}</div>
            </div>
          ))}
        </div>
      )}
      {user ? (
        <form className="place-comment-form" onSubmit={handleSend}>
          <img
            src={'/default-dog-avatar.png'}
            alt="Tavo šuniukas"
            className="place-comment-avatar"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Parašyk komentarą..."
            rows={2}
            disabled={sending}
            required
          />
          <button type="submit" disabled={sending || !text.trim()}>
            &gt;
          </button>
          {error && <div className="place-comment-error">{error}</div>}
        </form>
      ) : (
        <div className="place-comments-login-info">
          Norėdami komentuoti, <a href="/login">prisijunkite</a>.
        </div>
      )}
    </div>
  );
}

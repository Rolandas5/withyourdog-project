import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Comment } from '../types/typesComment';
import './UniversalComments.css';

interface UniversalCommentsProps {
  entityId: string;
  entityType: string;
}

interface DogProfile {
  _id: string;
  avatarUrl?: string;
  name: string;
  breed: string;
  hobbies: string[];
  favoritePlaces: string[];
}

export default function UniversalComments({
  entityId,
  entityType,
}: UniversalCommentsProps) {
  const { user, access_token } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [dogAvatar, setDogAvatar] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/comments/${entityType}/${entityId}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [entityId, entityType]);

  // Užkrauk šuns avatarą jei user prisijungęs
  useEffect(() => {
    if (user && user._id) {
      console.log('Gaunamas šuns profilis userId:', user._id);
      axios
        .get(`/api/dog-profile/user/${user._id}`)
        .then((res) => {
          const dogs: DogProfile[] = Array.isArray(res.data) ? res.data : [];
          console.log('Gauti šuns profiliai:', dogs);
          if (
            dogs.length &&
            dogs[0].avatarUrl &&
            dogs[0].avatarUrl !== '/default-dog-avatar.png'
          ) {
            setDogAvatar(dogs[0].avatarUrl);
          } else {
            setDogAvatar(null);
          }
        })
        .catch((err) => {
          console.log('Klaida gaunant šuns profilį:', err);
          setDogAvatar(null);
        });
    } else {
      setDogAvatar(null);
    }
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !access_token) return;
    setSending(true);
    setError('');
    try {
      const res = await axios.post(
        `/api/comments/`,
        { entityId, entityType, text },
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
    <div className="universal-comments-container">
      <div className="universal-comments-title">Komentarai</div>
      {loading ? (
        <div className="universal-comments-loading">Kraunama...</div>
      ) : comments.length === 0 ? null : (
        <div className="universal-comments-list">
          {comments.map((c) => (
            <div key={c._id} className="universal-comment-card">
              <div className="universal-comment-header">
                {c.avatarUrl && c.avatarUrl !== '/default-dog-avatar.png' ? (
                  <img
                    src={c.avatarUrl}
                    alt="Šuniuko nuotrauka"
                    className="universal-comment-avatar"
                  />
                ) : (
                  <span className="universal-comment-avatar-emoji">🐶</span>
                )}
                <div>
                  <div className="universal-comment-username">{c.username}</div>
                  <div className="universal-comment-date">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="universal-comment-text">{c.text}</div>
            </div>
          ))}
        </div>
      )}
      {user ? (
        <form className="universal-comment-form" onSubmit={handleSend}>
          {dogAvatar ? (
            <img
              src={dogAvatar}
              alt="Tavo šuniukas"
              className="universal-comment-avatar"
            />
          ) : (
            <span className="universal-comment-avatar-emoji">🐶</span>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Parašyk komentarą..."
            rows={1}
            disabled={sending}
            required
            style={{
              fontSize: '0.92rem',
              minHeight: 22,
              maxHeight: 40,
              padding: '4px 6px 2px 6px',
            }}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            title="Siųsti"
          >
            &gt;
          </button>
          {error && <div className="universal-comment-error">{error}</div>}
        </form>
      ) : (
        <div className="universal-comments-login-info">
          Norėdami komentuoti, <a href="/login">prisijunkite</a>.
        </div>
      )}
    </div>
  );
}

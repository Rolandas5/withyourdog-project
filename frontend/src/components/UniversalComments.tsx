import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Comment } from '../types/typesComment';
import './UniversalComments.css';
import { DogProfile } from '../types/typesDogProfile';

interface UniversalCommentsProps {
  entityId: string;
  entityType: string;
}

// Pagalbinė funkcija avataro url gavimui
function getAvatarUrl(avatarUrl?: string) {
  if (!avatarUrl || avatarUrl === '/default-dog-avatar.png') return null;
  if (avatarUrl.startsWith('http')) return avatarUrl;
  if (avatarUrl.startsWith('/')) return avatarUrl;
  return `/uploads/${avatarUrl}`;
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
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [selectedDogIdx, setSelectedDogIdx] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/comments/${entityType}/${entityId}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [entityId, entityType]);

  // Užkrauk šuns profilius jei user prisijungęs
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`/api/dog-profile/user/${user._id}`)
        .then((res) => {
          const dogs: DogProfile[] = Array.isArray(res.data) ? res.data : [];
          setDogProfiles(dogs);
          setSelectedDogIdx(0);
          setDogAvatar(getAvatarUrl(dogs[0]?.avatarUrl));
        })
        .catch((err) => {
          console.log('Klaida gaunant šuns profilį:', err);
          setDogAvatar(null);
          setDogProfiles([]);
        });
    } else {
      setDogAvatar(null);
      setDogProfiles([]);
      setSelectedDogIdx(0);
    }
  }, [user]);

  // Kai pasirenka kitą šunį
  useEffect(() => {
    if (dogProfiles.length > 0) {
      setDogAvatar(getAvatarUrl(dogProfiles[selectedDogIdx]?.avatarUrl));
    }
  }, [selectedDogIdx, dogProfiles]);

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
        <>
          {dogProfiles.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 4,
                marginLeft: 2,
              }}
            >
              <span
                style={{
                  fontSize: '0.92rem',
                  color: '#8a99b3',
                  marginRight: 4,
                }}
              >
                Pasirink šunį:
              </span>
              {dogProfiles.map((dog, idx) => (
                <img
                  key={dog._id}
                  src={getAvatarUrl(dog.avatarUrl) || undefined}
                  alt={dog.name}
                  title={dog.name}
                  className="universal-comment-avatar"
                  style={{
                    border:
                      idx === selectedDogIdx
                        ? '2.5px solid #4a90e2'
                        : '2px solid #e3eaf2',
                    opacity: idx === selectedDogIdx ? 1 : 0.6,
                    cursor: 'pointer',
                    width: 32,
                    height: 32,
                    marginRight: 2,
                  }}
                  onClick={() => setSelectedDogIdx(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedDogIdx(idx);
                  }}
                  tabIndex={0}
                />
              ))}
            </div>
          )}
          <form className="universal-comment-form" onSubmit={handleSend}>
            {dogAvatar ? (
              <img
                src={getAvatarUrl(dogAvatar) || undefined}
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
        </>
      ) : (
        <div className="universal-comments-login-info">
          Norėdami komentuoti, <a href="/login">prisijunkite</a>.
        </div>
      )}
    </div>
  );
}

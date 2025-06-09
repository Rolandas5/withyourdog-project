import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_URL } from '../../../constants/global';
import './experience-reviews.css';
import { Review } from '../../../types/typesReview';

function StarRating({
  rating,
  onChange,
  editable = false,
}: {
  rating: number;
  onChange?: (n: number) => void;
  editable?: boolean;
}) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? 'star filled' : 'star'}
          style={editable ? { cursor: 'pointer' } : {}}
          onClick={editable && onChange ? () => onChange(n) : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExperienceReviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    user: user?.name || '',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    rating: 5,
    text: '',
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [editModal, setEditModal] = useState<{
    open: boolean;
    review?: Review;
  }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    review?: Review;
  }>({ open: false });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/experience-reviews`)
      .then((res) => setReviews(res.data.reverse()))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (n: number) => setForm({ ...form, rating: n });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setValidationError('');
    if (!form.user.trim() || !form.text.trim()) {
      setValidationError('Užpildykite visus laukus!');
      setSending(false);
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/experience-reviews`, {
        ...form,
        date: getToday(),
      });
      setReviews([res.data, ...reviews]);
      setForm({
        user: user?.name || '',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        rating: 5,
        text: '',
      });
    } catch {
      setError('Nepavyko išsaugoti atsiliepimo.');
    }
    setSending(false);
  };

  const openEdit = (review: Review) => setEditModal({ open: true, review });
  const closeEdit = () => setEditModal({ open: false });
  const openDelete = (review: Review) => setDeleteModal({ open: true, review });
  const closeDelete = () => setDeleteModal({ open: false });

  const handleEditSave = async (updated: Review) => {
    try {
      const res = await axios.patch(
        `${API_URL}/experience-reviews/${updated._id}`,
        updated
      );
      setReviews(reviews.map((r) => (r._id === updated._id ? res.data : r)));
      closeEdit();
    } catch {
      alert('Nepavyko atnaujinti atsiliepimo.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${API_URL}/experience-reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      closeDelete();
    } catch {
      alert('Nepavyko ištrinti atsiliepimo.');
    }
  };

  return (
    <section className="experience-reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">
          Atsiliepimai apie lankytinas vietas ir keliones
        </h2>
        {user && (
          <button
            className={`add-review-btn${showForm ? ' active' : ''}`}
            onClick={() => setShowForm((v) => !v)}
            type="button"
          >
            {showForm ? 'Atšaukti' : '+ Pridėti atsiliepimą'}
          </button>
        )}
      </div>
      {user && showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="user"
              placeholder="Jūsų vardas"
              value={form.user}
              onChange={handleInput}
              className="form-input"
            />
            <input
              type="text"
              name="avatar"
              placeholder="Avataro nuoroda (URL)"
              value={form.avatar}
              onChange={handleInput}
              className="form-input"
            />
            <StarRating rating={form.rating} onChange={handleRating} editable />
            <div className="form-actions">
              <button
                className="submit-review-btn"
                type="submit"
                disabled={sending}
              >
                {sending ? 'Siunčiama...' : 'Pridėti atsiliepimą'}
              </button>
            </div>
          </div>
          <textarea
            name="text"
            placeholder="Jūsų atsiliepimas..."
            value={form.text}
            onChange={handleInput}
            className="form-textarea"
            rows={3}
          />
          {validationError && (
            <div className="form-error validation-error">{validationError}</div>
          )}
          {error && <div className="form-error">{error}</div>}
        </form>
      )}
      <div className="reviews-list">
        {loading ? (
          <div style={{ textAlign: 'center', margin: 30 }}>Kraunama...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">Dar nėra atsiliepimų. Būk pirmas!</div>
        ) : (
          reviews.map((review) => (
            <div
              className="review-card"
              key={review._id || review.date + review.user}
            >
              <img
                src={review.avatar}
                alt={review.user}
                className="review-avatar"
              />
              <div className="review-content">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <span className="review-date">{review.date}</span>
                  <StarRating rating={review.rating} />
                  {user && (
                    <>
                      <button
                        className="review-edit-btn"
                        onClick={() => openEdit(review)}
                        title="Redaguoti"
                      >
                        ✏️
                      </button>
                      <button
                        className="review-delete-btn"
                        onClick={() => openDelete(review)}
                        title="Ištrinti"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
                <div className="review-text">{review.text}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Redagavimo modaliukas */}
      {editModal.open && editModal.review && (
        <EditReviewModal
          review={editModal.review}
          onSave={handleEditSave}
          onClose={closeEdit}
        />
      )}
      {/* Trynimo modaliukas */}
      {deleteModal.open && deleteModal.review && (
        <DeleteReviewModal
          review={deleteModal.review}
          onDelete={() => handleDelete(deleteModal.review?._id)}
          onClose={closeDelete}
        />
      )}
    </section>
  );
}

// Modalai
function EditReviewModal({
  review,
  onSave,
  onClose,
}: {
  review: Review;
  onSave: (r: Review) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...review });
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRating = (n: number) => setForm({ ...form, rating: n });
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Redaguoti atsiliepimą</h3>
        <input
          type="text"
          name="user"
          value={form.user}
          onChange={handleInput}
          className="form-input"
        />
        <input
          type="text"
          name="avatar"
          value={form.avatar}
          onChange={handleInput}
          className="form-input"
        />
        <StarRating rating={form.rating} onChange={handleRating} editable />
        <textarea
          name="text"
          value={form.text}
          onChange={handleInput}
          className="form-textarea"
          rows={3}
        />
        <div className="modal-actions">
          <button className="submit-review-btn" onClick={() => onSave(form)}>
            Išsaugoti
          </button>
          <button className="review-delete-btn" onClick={onClose}>
            Atšaukti
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteReviewModal({
  review,
  onDelete,
  onClose,
}: {
  review: Review;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Ar tikrai ištrinti šį atsiliepimą?</h3>
        <div style={{ margin: '18px 0' }}>
          <b>{review.user}</b>: {review.text}
        </div>
        <div className="modal-actions">
          <button className="review-delete-btn" onClick={onDelete}>
            Ištrinti
          </button>
          <button className="submit-review-btn" onClick={onClose}>
            Atšaukti
          </button>
        </div>
      </div>
    </div>
  );
}

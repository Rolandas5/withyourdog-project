import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../constants/global';
import '../../../pages/explore/experiences/experience-reviews.css';

interface Review {
  _id?: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  ip?: string;
}

export default function AdminExperienceReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    review?: Review;
  }>({ open: false });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    review?: Review;
  }>({ open: false });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/experience-reviews`)
      .then((res) => setReviews(res.data.reverse()))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="admin-reviews-table-wrapper">
      <h2 className="reviews-title" style={{ marginBottom: 18 }}>
        Visi atsiliepimai
      </h2>
      {loading ? (
        <div style={{ textAlign: 'center', margin: 30 }}>Kraunama...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">Nėra atsiliepimų.</div>
      ) : (
        <table className="admin-reviews-table">
          <thead>
            <tr>
              <th>Vartotojas</th>
              <th>Nuotrauka</th>
              <th>Data</th>
              <th>IP adresas</th>
              <th>Įvertinimas</th>
              <th>Atsiliepimas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.user}</td>
                <td>
                  <img
                    src={review.avatar}
                    alt={review.user}
                    style={{ width: 38, height: 38, borderRadius: '50%' }}
                  />
                </td>
                <td>{review.date}</td>
                <td style={{ fontSize: '0.98rem', color: '#8a99b3' }}>
                  {review.ip || '-'}
                </td>
                <td>
                  <StarRating rating={review.rating} />
                </td>
                <td>{review.text}</td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Redagavimo modalas */}
      {editModal.open && editModal.review && (
        <EditReviewModal
          review={editModal.review}
          onSave={handleEditSave}
          onClose={closeEdit}
        />
      )}
      {/* Trynimo modalas */}
      {deleteModal.open && deleteModal.review && (
        <DeleteReviewModal
          review={deleteModal.review}
          onDelete={() => handleDelete(deleteModal.review?._id)}
          onClose={closeDelete}
        />
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}

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
        <StarRating rating={form.rating} />
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

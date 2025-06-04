import React from 'react';
import './delete-user-modal.css';

interface DeleteUserModalProps {
  userName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  userName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="dashboard-modal-overlay">
      <div className="dashboard-modal-card">
        <button className="dashboard-close-btn" onClick={onCancel}>
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
          {userName ? (
            <>
              Ar tikrai norite ištrinti vartotoją <b>{userName}</b>?
            </>
          ) : (
            'Ar tikrai norite ištrinti vartotoją?'
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button
            className="profile-save-btn"
            style={{
              background: 'linear-gradient(90deg, #f23d5c, #c72d45 90%)',
              color: '#fff',
              minWidth: 80,
            }}
            onClick={onConfirm}
          >
            Taip
          </button>
          <button
            className="profile-save-btn"
            style={{
              background: 'linear-gradient(90deg, #28a745, #43d17a 90%)',
              color: '#fff',
              minWidth: 80,
            }}
            onClick={onCancel}
          >
            Ne
          </button>
        </div>
      </div>
    </div>
  );
};

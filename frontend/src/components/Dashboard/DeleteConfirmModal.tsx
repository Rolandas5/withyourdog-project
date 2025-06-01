import React from 'react';

interface DeleteConfirmModalProps {
  dogName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  dogName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div
        className="modal-card"
        style={{ textAlign: 'center', maxWidth: 340 }}
      >
        <button className="close-btn" onClick={onCancel}>
          &times;
        </button>
        <h2 style={{ color: '#f23d5c', marginBottom: 18 }}>
          Ar tikrai ištrinti?
        </h2>
        <div style={{ fontSize: '1.08rem', marginBottom: 22 }}>
          {dogName ? (
            <>
              Ar tikrai norite ištrinti šuniuką <b>{dogName}</b>?
            </>
          ) : (
            'Ar tikrai norite ištrinti šuniuko profilį?'
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

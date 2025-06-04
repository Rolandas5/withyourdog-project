import React from 'react';
import './admin-messages-tab.css';
import { Message } from '../../../../types/typesMessage';

interface DeleteMessageModalProps {
  message: Message;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  message,
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
          Ar tikrai norite ištrinti žinutę iš <b>{message.name}</b>?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          <button
            type="button"
            className="delete-btn-modal"
            onClick={onConfirm}
          >
            Taip
          </button>
          <button type="button" className="cancel-btn-modal" onClick={onCancel}>
            Ne
          </button>
        </div>
      </div>
    </div>
  );
};

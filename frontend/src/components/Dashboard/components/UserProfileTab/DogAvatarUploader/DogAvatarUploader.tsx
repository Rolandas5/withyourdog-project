import { useRef, useState } from 'react';
import { API_URL } from '../../../../../constants/global';
import './dog-avatar-uploader.css';

interface DogAvatarUploaderProps {
  avatarUrl: string;
  onUpload: (url: string) => void;
  onPreview?: (previewUrl: string) => void;
}

export const DogAvatarUploader: React.FC<DogAvatarUploaderProps> = ({
  avatarUrl,
  onUpload,
  onPreview,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onPreview) {
      onPreview(URL.createObjectURL(file));
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_URL}/dog-profile/upload-avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url); // Grąžina pvz. `/uploads/1721872719263.png`
      } else {
        setError('Nepavyko įkelti nuotraukos');
      }
    } catch {
      setError('Įvyko klaida įkeliant failą');
    }
    setLoading(false);
  };

  return (
    <div>
      <label className="avatar-upload-btn">
        Įkelti nuotrauką
        <input
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </label>
      {loading && <span>Keliama...</span>}
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

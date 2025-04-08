import { useState, useRef } from 'react';
import { ProfileService } from '../../services/profileService';
import './ProfilePhoto.css';

function ProfilePhoto({ profileId, initialPhotoUrl, onPhotoUpdate }) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Fonction pour convertir le fichier en base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.match('image.*')) {
      setError('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La taille de l'image ne doit pas dépasser 5MB");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convertir l'image en base64
      const base64Image = await toBase64(file);

      // Mettre à jour la photo de profil
      const response = await ProfileService.updatePhoto(profileId, base64Image);

      setPhotoUrl(base64Image);

      // Informer le composant parent de la mise à jour
      if (onPhotoUpdate) {
        onPhotoUpdate(base64Image);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du téléchargement de la photo');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-photo-container">
      <div className="profile-photo-wrapper" onClick={triggerFileInput}>
        {photoUrl ? (
          <img src={photoUrl} alt="Photo de profil" className="profile-photo" />
        ) : (
          <div className="profile-photo-placeholder">
            <span>{initialPhotoUrl ? 'Changer' : 'Ajouter'}</span>
          </div>
        )}

        {!loading && (
          <div className="profile-photo-overlay">
            <span className="profile-photo-edit-icon">📷</span>
          </div>
        )}

        {loading && (
          <div className="profile-photo-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="profile-photo-input"
      />

      {error && <div className="profile-photo-error">{error}</div>}

      <div className="profile-photo-help">
        Cliquez sur l'image pour {photoUrl ? 'changer' : 'ajouter'} une photo
      </div>
    </div>
  );
}

export default ProfilePhoto;

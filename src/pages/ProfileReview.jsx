import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { ProfileService } from '../services/profileService';
import ProfilePhoto from '../components/profile/ProfilePhoto';
import './ProfileReview.css';

function ProfileReview() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState({});
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const currentProfile = AuthService.getCurrentProfile();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setProfile(currentProfile);
    setFormData(currentProfile || {});
    setLoading(false);
  }, [navigate]);

  const handleEdit = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const handleCancel = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: false,
    }));

    // Réinitialiser les données du formulaire avec les valeurs du profil
    setFormData((prev) => ({
      ...prev,
      ...profile,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpdate = (photoUrl) => {
    setProfile((prev) => ({
      ...prev,
      photo_profil: photoUrl,
    }));
  };

  const handleSave = async (section) => {
    setSaving(true);

    try {
      let updatedProfile;

      switch (section) {
        case 'prenom':
          updatedProfile = await ProfileService.updateProfile(profile.id, {
            prenom: formData.prenom,
          });
          break;
        case 'objectif':
          updatedProfile = await ProfileService.updateObjectifsSante(
            profile.id,
            formData.objectif_sante
          );
          break;
        case 'regime':
          updatedProfile = await ProfileService.updateRegimeParticulier(profile.id, {
            regime_particulier: formData.regime_particulier,
            autres_regimes: formData.autres_regimes,
          });
          break;
        case 'physique':
          updatedProfile = await ProfileService.updateDonneesPhysiques(profile.id, {
            sexe: formData.sexe,
            age: formData.age,
            taille: formData.taille,
            poids: formData.poids,
          });
          break;
        case 'budget':
          updatedProfile = await ProfileService.updateBudget(
            profile.id,
            formData.budget_alimentaire
          );
          break;
        default:
          break;
      }

      setProfile(updatedProfile.data);
      setEditMode((prev) => ({
        ...prev,
        [section]: false,
      }));
    } catch (error) {
      setError(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);

    try {
      // Marquer le profil comme complet
      await ProfileService.updateFreemium(profile.id, profile.freemium === 1);
      navigate('/home');
    } catch (error) {
      setError(error.message || 'Erreur lors de la finalisation du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-review-loading">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="profile-review-container">
      <header className="profile-review-header">
        <h1>Récapitulatif de votre profil</h1>
        <p>Vérifiez et modifiez vos informations avant de continuer</p>
      </header>

      {error && <div className="profile-review-error">{error}</div>}

      <div className="profile-review-content">
        <div className="profile-top">
          <div className="profile-picture">
            <ProfilePhoto
              profileId={profile?.id}
              initialPhotoUrl={profile?.photo_profil}
              onPhotoUpdate={handlePhotoUpdate}
            />
            <div className="picture-info">
              <p>Format JPG, GIF ou PNG. Taille max. 800K</p>
            </div>
          </div>
          <div className="profile-buttons">
            <button
              className="upload-button"
              onClick={() => document.getElementById('photo-upload').click()}
            >
              Changer la photo
            </button>
            <button className="delete-button" onClick={() => handlePhotoUpdate(null)}>
              Supprimer
            </button>
          </div>
        </div>

        <div className="name-fields">
          <div className="input-group">
            <label>Prénom</label>
            {!editMode.prenom ? (
              <div className="input-value">
                <span>{user?.prenom || 'Utilisateur'}</span>
                <button className="edit-button" onClick={() => handleEdit('prenom')}>
                  Modifier
                </button>
              </div>
            ) : (
              <div className="input-edit">
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom || ''}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                />
                <div className="edit-actions">
                  <button className="cancel-button" onClick={() => handleCancel('prenom')}>
                    Annuler
                  </button>
                  <button
                    className="save-button"
                    onClick={() => handleSave('prenom')}
                    disabled={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="input-group">
            <label>Email</label>
            <div className="input-value">
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <section className="profile-section">
          <div className="section-header">
            <h3>Objectif santé</h3>
            {!editMode.objectif ? (
              <button className="edit-button" onClick={() => handleEdit('objectif')}>
                Modifier
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-button" onClick={() => handleCancel('objectif')}>
                  Annuler
                </button>
                <button
                  className="save-button"
                  onClick={() => handleSave('objectif')}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          {!editMode.objectif ? (
            <div className="section-content">
              <p>{profile?.objectif_sante || 'Non défini'}</p>
            </div>
          ) : (
            <div className="section-edit">
              <div className="form-group">
                <label>Objectif santé</label>
                <select
                  name="objectif_sante"
                  value={formData.objectif_sante || ''}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un objectif</option>
                  <option value="prise-de-masse">Prise de masse</option>
                  <option value="perte-de-poids">Perte de poids</option>
                  <option value="stabilisation">Stabilisation du poids</option>
                  <option value="regime-particulier">Régime particulier</option>
                </select>
              </div>
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="section-header">
            <h3>Régime alimentaire</h3>
            {!editMode.regime ? (
              <button className="edit-button" onClick={() => handleEdit('regime')}>
                Modifier
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-button" onClick={() => handleCancel('regime')}>
                  Annuler
                </button>
                <button
                  className="save-button"
                  onClick={() => handleSave('regime')}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          {!editMode.regime ? (
            <div className="section-content">
              <p>
                {profile?.regime_particulier?.replace(/,/g, ', ') || 'Aucun régime particulier'}
              </p>
              {profile?.autres_regimes && (
                <p>
                  <strong>Autre régime:</strong> {profile.autres_regimes}
                </p>
              )}
            </div>
          ) : (
            <div className="section-edit">
              <div className="form-group">
                <label>Régimes particuliers</label>
                <textarea
                  name="regime_particulier"
                  value={formData.regime_particulier || ''}
                  onChange={handleChange}
                  placeholder="sans_gluten,sans_lactose,proteine,vegetarien..."
                />
              </div>
              <div className="form-group">
                <label>Autres régimes ou précisions</label>
                <textarea
                  name="autres_regimes"
                  value={formData.autres_regimes || ''}
                  onChange={handleChange}
                  placeholder="Détails sur vos régimes alimentaires..."
                />
              </div>
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="section-header">
            <h3>Données physiques</h3>
            {!editMode.physique ? (
              <button className="edit-button" onClick={() => handleEdit('physique')}>
                Modifier
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-button" onClick={() => handleCancel('physique')}>
                  Annuler
                </button>
                <button
                  className="save-button"
                  onClick={() => handleSave('physique')}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          {!editMode.physique ? (
            <div className="section-content">
              <div className="data-grid">
                <div className="data-item">
                  <span className="data-label">Sexe</span>
                  <span className="data-value">{profile?.sexe || '-'}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Âge</span>
                  <span className="data-value">{profile?.age ? `${profile.age} ans` : '-'}</span>
                </div>
                <div className="data-item">
                  <span className="data-label">Taille</span>
                  <span className="data-value">
                    {profile?.taille ? `${profile.taille} cm` : '-'}
                  </span>
                </div>
                <div className="data-item">
                  <span className="data-label">Poids</span>
                  <span className="data-value">{profile?.poids ? `${profile.poids} kg` : '-'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="section-edit">
              <div className="form-row">
                <div className="form-group">
                  <label>Sexe</label>
                  <select name="sexe" value={formData.sexe || ''} onChange={handleChange}>
                    <option value="">Sélectionnez</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Âge</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Taille (cm)</label>
                  <input
                    type="number"
                    name="taille"
                    value={formData.taille || ''}
                    onChange={handleChange}
                    min="50"
                    max="250"
                  />
                </div>
                <div className="form-group">
                  <label>Poids (kg)</label>
                  <input
                    type="number"
                    name="poids"
                    value={formData.poids || ''}
                    onChange={handleChange}
                    min="20"
                    max="300"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="profile-section">
          <div className="section-header">
            <h3>Budget alimentaire</h3>
            {!editMode.budget ? (
              <button className="edit-button" onClick={() => handleEdit('budget')}>
                Modifier
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-button" onClick={() => handleCancel('budget')}>
                  Annuler
                </button>
                <button
                  className="save-button"
                  onClick={() => handleSave('budget')}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          {!editMode.budget ? (
            <div className="section-content">
              <p>
                {profile?.budget_alimentaire
                  ? `${profile.budget_alimentaire} € par mois`
                  : 'Non défini'}
              </p>
            </div>
          ) : (
            <div className="section-edit">
              <div className="form-group">
                <label>Budget mensuel (€)</label>
                <input
                  type="number"
                  name="budget_alimentaire"
                  value={formData.budget_alimentaire || ''}
                  onChange={handleChange}
                  min="50"
                  max="2000"
                />
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="profile-review-actions">
        <button className="complete-button" onClick={handleComplete} disabled={saving}>
          {saving ? 'Validation...' : 'Valider'}
        </button>
      </div>
    </div>
  );
}

export default ProfileReview;

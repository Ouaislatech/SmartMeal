import { AuthService } from '../services/authService';
import '../pages/Home.css';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Déconnexion
    </button>
  );
}

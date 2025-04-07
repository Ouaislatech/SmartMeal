import { useState, useEffect } from "react";
import OnboardingForm from "../components/OnboardingForm";
import { ApiService } from "../services/api";
import "./Home.css";

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState({ connected: false, status: "" });

  // Vérifier l'état de l'API au chargement
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const status = await ApiService.checkStatus();
        setApiStatus({ connected: true, status: status.status });
      } catch (error) {
        setApiStatus({ connected: false, status: "Déconnecté" });
        setError(
          "Impossible de se connecter au serveur. Veuillez vérifier que le backend est démarré."
        );
      }
    };

    checkApiStatus();
  }, []);

  // Charger la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      if (!apiStatus.connected) return;

      try {
        setLoading(true);
        const response = await ApiService.getAllUsers();
        setUsers(response.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Erreur lors du chargement des profils utilisateurs");
      }
    };

    fetchUsers();
  }, [apiStatus.connected]);

  // Gérer la création d'un nouvel utilisateur
  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>SmartMeal</h1>
        <p>Votre assistant de nutrition personnalisé</p>

        <div
          className={`api-status ${
            apiStatus.connected ? "connected" : "disconnected"
          }`}
        >
          API: {apiStatus.status || "Vérification..."}
        </div>
      </header>

      <main className="main-content">
        <section className="onboarding-section">
          <OnboardingForm onUserCreated={handleUserCreated} />
        </section>

        {apiStatus.connected && (
          <section className="users-section">
            <h2>Profils enregistrés</h2>

            {error && <p className="error-text">{error}</p>}

            {loading ? (
              <p>Chargement des profils...</p>
            ) : (
              <div className="users-list">
                {users.length === 0 ? (
                  <p>Aucun profil utilisateur enregistré</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="user-card">
                      <h3>{user.prenom}</h3>
                      <p>
                        <strong>Objectif:</strong> {user.objectif}
                      </p>
                      {user.allergies && (
                        <p>
                          <strong>Allergies:</strong> {user.allergies}
                        </p>
                      )}
                      {user.preferences && (
                        <p>
                          <strong>Préférences:</strong> {user.preferences}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} SmartMeal - Application développée
          localement
        </p>
      </footer>
    </div>
  );
}

export default Home;

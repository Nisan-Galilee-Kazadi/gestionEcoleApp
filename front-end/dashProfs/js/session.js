class SessionManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userData = JSON.parse(localStorage.getItem('userData'));
    }

    isLoggedIn() {
        return !!(this.token && this.userData);
    }

    async checkSession() {
        if (!this.isLoggedIn()) {
            return false;
        }

        try {
            const response = await fetch('http://localhost:5002/api/enseignant/verify-session', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erreur de vérification de session:', error);
            return false;
        }
    }

    setSession(token, userData) {
        this.token = token;
        this.userData = userData;
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.token = null;
        this.userData = null;
        window.location.href = '../public/connectProf.html';
    }

    getUserData() {
        return this.userData;
    }
}

// Créer une instance unique du gestionnaire de session
const sessionManager = new SessionManager();

// Protéger les pages qui nécessitent une authentification
async function requireAuth() {
    if (!await sessionManager.checkSession()) {
        window.location.href = '../public/connectProf.html';
        return false;
    }
    return true;
}

// Vérification immédiate de la session au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await requireAuth();
});
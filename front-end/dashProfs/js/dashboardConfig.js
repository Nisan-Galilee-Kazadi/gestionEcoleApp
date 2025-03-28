const dashboardConfig = {
    async initializePage() {
        // Vérifier l'authentification
        if (!await requireAuth()) return;

        const userData = sessionManager.getUserData();

        // Mettre à jour les éléments de la page avec les données de l'utilisateur
        this.updateUserInterface(userData);

        // Charger les données spécifiques à la page
        await this.loadPageSpecificData();
    },

    updateUserInterface(userData) {
        // Mettre à jour le nom d'utilisateur dans la topbar
        const userNameElement = document.querySelector('.topbar-profile');
        if (userNameElement) {
            userNameElement.setAttribute('title', userData.name);
        }

        // Mettre à jour l'image de profil
        const profileImage = document.getElementById('navbarProfileImage');
        if (profileImage) {
            profileImage.alt = userData.name;
        }
    },

    async loadPageSpecificData() {
        try {
            const response = await fetch(`http://localhost:5002/api/enseignant/${userData.userId}/dashboard-data`, {
                headers: {
                    'Authorization': `Bearer ${sessionManager.getToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Erreur de chargement des données');
            
            const data = await response.json();
            this.updateDashboard(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    },

    updateDashboard(data) {
        // Cette méthode sera différente pour chaque page
        console.log('Données reçues:', data);
    }
};
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const profileForm = document.querySelector('#profile-form');
    const securityForm = document.querySelector('#security-form');
    const profileImage = document.querySelector('.profile-image');
    const profileUpload = document.querySelector('#profile-upload');
    const profileName = document.querySelector('.profile-name');

    // Gestion de l'upload d'image
    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Prévisualisation de l'image
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Mise à jour du profil
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            
            // Ajout de la photo si elle existe
            if (profileUpload.files[0]) {
                formData.append('photo', profileUpload.files[0]);
            }

            const response = await fetch('backend/update_profile.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Mise à jour de l'interface
                profileName.textContent = formData.get('fullname');
                document.querySelector('.info-content[data-type="email"] p').textContent = formData.get('email');
                document.querySelector('.info-content[data-type="phone"] p').textContent = formData.get('phone');
                document.querySelector('.info-content[data-type="address"] p').textContent = formData.get('address');

                showNotification('Profil mis à jour avec succès', 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Modification du mot de passe
    securityForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const formData = new FormData(this);
            
            // Vérification de la correspondance des mots de passe
            if (formData.get('new_password') !== formData.get('confirm_password')) {
                throw new Error('Les nouveaux mots de passe ne correspondent pas');
            }

            const response = await fetch('backend/update_password.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Mot de passe mis à jour avec succès', 'success');
                this.reset();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Fonction pour afficher les notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 100);
    }
}); 
document.addEventListener('DOMContentLoaded', async function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.settings-tab');
    
    function switchTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        navBtns.forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(`${tabId}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            switchTab(btn.dataset.tab);
        });
    });
    
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.querySelector('.profile-image');
    
    profileUpload.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5002/admin/update-photo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                // Mettre à jour l'image affichée
                document.getElementById('profileImage').src = URL.createObjectURL(file);
                showNotification('Photo de profil mise à jour avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            showNotification('Erreur lors de la mise à jour de la photo', 'error');
        }
    });

    const forms = document.querySelectorAll('.settings-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = form.querySelector('.btn-save');
            btn.style.pointerEvents = 'none';
            btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sauvegarde...';

            setTimeout(() => {
                btn.innerHTML = '<i class="bx bx-check"></i> Sauvegardé!';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.style.pointerEvents = 'auto';
                    btn.style.background = '#b88f1e';
                    btn.innerHTML = btn.dataset.originalText || '<i class="bx bx-save"></i> Enregistrer';
                }, 2000);
            }, 1500);
        });
    });
    
    document.querySelectorAll('.btn-save').forEach(btn => {
        btn.dataset.originalText = btn.innerHTML;
    });

    try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('token');
        
        // Faire la requête pour obtenir les informations de l'admin
        const response = await fetch('http://localhost:5002/admin/info', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour les informations textuelles
            document.getElementById('adminName').textContent = data.data.fullname;
            document.getElementById('adminPhone').textContent = data.data.phone;
            document.getElementById('adminEmail').textContent = data.data.email;
            document.getElementById('adminAddress').textContent = data.data.address;

            // Mettre à jour la photo de profil
            const profileImage = document.getElementById('profileImage');
            if (data.data.photo) {
                // Construire l'URL complète de la photo
                const photoUrl = `http://localhost:5002/uploads/avatars/${data.data.photo}`;
                profileImage.src = photoUrl;
            } else {
                // Utiliser une image par défaut si aucune photo n'est disponible
                profileImage.src = 'avatar/admin.jpg';
            }

            // Pré-remplir le formulaire de profil
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.querySelector('input[name="fullname"]').value = data.data.fullname;
                profileForm.querySelector('input[name="email"]').value = data.data.email;
                profileForm.querySelector('input[name="phone"]').value = data.data.phone;
                profileForm.querySelector('input[name="address"]').value = data.data.address;
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});

function validatePassword() {
    const newPass = document.querySelector('input[type="password"]:nth-of-type(2)').value;
    const confirmPass = document.querySelector('input[type="password"]:nth-of-type(3)').value;
    
    if (newPass !== confirmPass) {
        alert('Les mots de passe ne correspondent pas');
        return false;
    }
    return true;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}
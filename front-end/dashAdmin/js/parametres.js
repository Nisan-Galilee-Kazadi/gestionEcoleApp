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
    
    // Gestion de l'upload d'image
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profileImage');

    profileUpload.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('photo', file);

                const response = await fetch('http://localhost:5002/admin/update-photo', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'upload');
                }

                const result = await response.json();
                
                if (result.success) {
                    // Mettre à jour l'image affichée avec la nouvelle URL
                    profileImage.src = `http://localhost:5002/uploads/avatars/${result.photo}`;
                    showNotification('✅ Photo de profil mise à jour avec succès', 'success');
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('❌ Erreur:', error);
                showNotification('❌ Erreur lors de la mise à jour de la photo', 'error');
                // En cas d'erreur, remettre l'ancienne photo
                loadAdminInfo();
            }
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

    // Fonction simplifiée pour charger les informations de l'admin
    async function loadAdminInfo() {
        try {
            const response = await fetch('http://localhost:5002/admin/test-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Données admin reçues:', result);

            if (result.success) {
                // Mise à jour des informations textuelles
                document.getElementById('adminName').textContent = result.admin.fullname || 'Admin';
                document.getElementById('adminPhone').textContent = result.admin.phone || 'Non renseigné';
                document.getElementById('adminEmail').textContent = result.admin.email || 'Non renseigné';
                document.getElementById('adminAddress').textContent = result.admin.address || 'Non renseigné';

                // Mise à jour de la photo de profil
                const profileImage = document.getElementById('profileImage');
                if (result.admin.photo) {
                    profileImage.src = `http://localhost:5002/uploads/avatars/${result.admin.photo}`;
                    profileImage.onerror = function() {
                        this.src = 'avatar/admin.jpg';
                    };
                }

                // Pré-remplir le formulaire de profil
                const profileForm = document.getElementById('profileForm');
                if (profileForm) {
                    profileForm.querySelector('input[name="fullname"]').value = result.admin.fullname || '';
                    profileForm.querySelector('input[name="email"]').value = result.admin.email || '';
                    profileForm.querySelector('input[name="phone"]').value = result.admin.phone || '';
                    profileForm.querySelector('input[name="address"]').value = result.admin.address || '';
                }
            }
        } catch (error) {
            console.error('❌ Erreur chargement données admin:', error);
            showNotification('Erreur lors du chargement des données', 'error');
        }
    }

    // Appel de la fonction au chargement
    await loadAdminInfo();
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
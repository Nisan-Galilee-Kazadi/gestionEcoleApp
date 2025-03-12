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

                console.log('📤 Envoi de l\'image...');

                const response = await fetch('http://localhost:5002/admin/update-photo', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('📥 Réponse serveur:', result);

                if (result.success) {
                    profileImage.src = `http://localhost:5002/uploads/avatars/${result.photo}`;
                    const navbarProfileImage = document.getElementById('navbarProfileImage');
                    if (navbarProfileImage) {
                        navbarProfileImage.src = `http://localhost:5002/uploads/avatars/${result.photo}`;
                    }
                    showNotification('✅ Photo de profil mise à jour avec succès', 'success');
                }
            } catch (error) {
                console.error('❌ Erreur:', error);
                showNotification('❌ Erreur lors de la mise à jour de la photo', 'error');
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
            const response = await fetch('http://localhost:5002/admin/test-data');
            const result = await response.json();
            console.log('📥 Données admin reçues:', result);

            if (result.success) {
                // Mise à jour uniquement des informations affichées dans la carte de profil
                document.getElementById('adminName').textContent = result.admin.fullname || 'Admin';
                document.getElementById('adminPhone').textContent = result.admin.phone || 'Non renseigné';
                document.getElementById('adminEmail').textContent = result.admin.email || 'Non renseigné';
                document.getElementById('adminAddress').textContent = result.admin.address || 'Non renseigné';

                // Mise à jour de la photo de profil si elle existe
                if (result.admin.photo) {
                    profileImage.src = `http://localhost:5002/uploads/avatars/${result.admin.photo}`;
                    // Mise à jour de l'image dans la navbar
                    document.getElementById('navbarProfileImage').src = `http://localhost:5002/uploads/avatars/${result.admin.photo}`;
                }
            }
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
        }
    }

    // Appel de la fonction au chargement
    await loadAdminInfo();

    // Gestion du formulaire de profil
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = profileForm.querySelector('.btn-save');
        btn.style.pointerEvents = 'none';
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sauvegarde...';

        try {
            const formData = new FormData(profileForm);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch('http://localhost:5002/admin/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showNotification('✅ Profil mis à jour avec succès', 'success');
                // Mettre à jour l'affichage
                document.getElementById('adminName').textContent = data.fullname;
                document.getElementById('adminPhone').textContent = data.phone;
                document.getElementById('adminEmail').textContent = data.email;
                document.getElementById('adminAddress').textContent = data.address;
            } else {
                throw new Error(result.message);
            }

            btn.innerHTML = '<i class="bx bx-check"></i> Sauvegardé!';
            btn.style.background = '#28a745';
        } catch (error) {
            console.error('❌ Erreur:', error);
            showNotification('❌ Erreur lors de la mise à jour', 'error');
            btn.innerHTML = '<i class="bx bx-x"></i> Erreur!';
            btn.style.background = '#dc3545';
        } finally {
            setTimeout(() => {
                btn.style.pointerEvents = 'auto';
                btn.style.background = '#b88f1e';
                btn.innerHTML = '<i class="bx bx-save"></i> Enregistrer les modifications';
            }, 2000);
        }
    });

    // Gestion du formulaire de sécurité
    document.getElementById('securityForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = e.target.querySelector('.btn-save');
        btn.style.pointerEvents = 'none';
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Mise à jour...';

        try {
            // Get form values
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Client-side validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new Error('Tous les champs sont requis');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('Les nouveaux mots de passe ne correspondent pas');
            }

            // Send request to server
            const response = await fetch('http://localhost:5002/admin/update-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            // Parse response
            const result = await response.json();
            
            if (result.success) {
                showNotification('✅ ' + result.message, 'success');
                e.target.reset();
                btn.innerHTML = '<i class="bx bx-check"></i> Mis à jour!';
                btn.style.background = '#28a745';
            } else {
                throw new Error(result.message || 'Erreur serveur');
            }

        } catch (error) {
            console.error('❌ Erreur:', error);
            showNotification('❌ ' + (error.message || 'Erreur serveur'), 'error');
            btn.innerHTML = '<i class="bx bx-x"></i> Erreur!';
            btn.style.background = '#dc3545';
        } finally {
            setTimeout(() => {
                btn.style.pointerEvents = 'auto';
                btn.style.background = '#b88f1e';
                btn.innerHTML = '<i class="bx bx-lock-alt"></i> Mettre à jour le mot de passe';
            }, 2000);
        }
    });
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
    notification.textContent = message;
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
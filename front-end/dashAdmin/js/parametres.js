document.addEventListener('DOMContentLoaded', function() {
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
    
    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            }
            reader.readAsDataURL(file);
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

    // Fonction pour charger les informations de l'admin
    async function loadAdminInfo() {
        try {
            const response = await fetch('http://localhost:5002/admin/info');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }
            const data = await response.json();
            document.getElementById('adminName').textContent = data.name;
            document.getElementById('adminPhone').textContent = data.phone;
            document.getElementById('adminEmail').textContent = data.email;
            document.getElementById('adminAddress').textContent = data.address;
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération des données');
        }
    }

    loadAdminInfo();
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
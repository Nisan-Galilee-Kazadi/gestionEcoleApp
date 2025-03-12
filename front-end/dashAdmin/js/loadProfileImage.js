async function loadProfileImage() {
    try {
        const response = await fetch('http://localhost:5002/admin/test-data');
        const result = await response.json();

        if (result.success && result.admin.photo) {
            const navbarProfileImage = document.getElementById('navbarProfileImage');
            if (navbarProfileImage) {
                navbarProfileImage.src = `http://localhost:5002/uploads/avatars/${result.admin.photo}`;
                navbarProfileImage.onerror = function() {
                    this.src = 'avatar/admin.jpg';
                };
            }
        }
    } catch (error) {
        console.error('❌ Erreur chargement image:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProfileImage);

async function updatePhoto(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('type', type); // 'student' ou 'tutor'
            formData.append('id', new URLSearchParams(window.location.search).get('id'));

            try {
                console.log('📤 Envoi de la photo...');
                const response = await fetch('http://localhost:5002/api/eleves/upload-photo', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'upload');
                }

                const result = await response.json();
                
                // Mettre à jour l'image affichée
                const imgElement = document.getElementById(type === 'student' ? 'studentPhoto' : 'tutorPhoto');
                imgElement.src = `http://localhost:5002/uploads/${result.filename}`;

                showNotification('✅ Photo mise à jour avec succès', 'success');
            } catch (error) {
                console.error('❌ Erreur:', error);
                showNotification('❌ Erreur lors de la mise à jour de la photo', 'error');
            }
        }
    };

    input.click();
}
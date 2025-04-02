class InsertionManager {
    // ... autres méthodes existantes ...

    async loadSelectData() {
        try {
            // Charger les classes
            const classResponse = await fetch('http://localhost:5002/api/classe/all');
            const classData = await classResponse.json();
            
            const classSelect = document.getElementById('courseClass');
            classSelect.innerHTML = '<option value="">Sélectionner une classe</option>';
            
            classData.data.forEach(classe => {
                classSelect.innerHTML += `
                    <option value="${classe._id}">${classe.name}</option>
                `;
            });

            // Charger les options
            const optionResponse = await fetch('http://localhost:5002/api/insertion/options');
            const optionData = await optionResponse.json();
            
            const optionSelect = document.getElementById('courseOption');
            optionSelect.innerHTML = '<option value="pas_necessaire">Pas nécessaire</option>';
            
            optionData.data.forEach(option => {
                optionSelect.innerHTML += `
                    <option value="${option._id}">${option.name}</option>
                `;
            });

        } catch (error) {
            console.error('Erreur chargement données:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de charger les données des sélecteurs',
                confirmButtonColor: '#dc3545'
            });
        }
    }

    // Méthode pour gérer le changement de classe
    handleClassChange(classId) {
        const optionSelect = document.getElementById('courseOption');
        // Si c'est une classe sans options
        if (/* condition pour classes sans options */) {
            optionSelect.value = 'pas_necessaire';
            optionSelect.disabled = true;
        } else {
            optionSelect.disabled = false;
        }
    }

    // Méthode pour ajouter un cours
    async addCourse(courseData) {
        try {
            const response = await fetch('http://localhost:5002/api/insertion/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            await Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: 'Cours ajouté avec succès',
                confirmButtonColor: '#b88f1e'
            });

            this.loadAllData();
            return true;

        } catch (error) {
            console.error('Erreur:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message,
                confirmButtonColor: '#dc3545'
            });
            return false;
        }
    }
}
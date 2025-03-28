async function handleClassSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("className").value;
  const classId = document.getElementById("classId").value;

  try {
    const response = await fetch("http://localhost:5002/api/classe/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, classId }),
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Classe ajoutée avec succès !",
      });

      // Réinitialiser le formulaire
      document.getElementById("classForm").reset();

      // Recharger la table des classes
      loadClassesTable();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: error.message || "Erreur lors de l'ajout de la classe",
    });
  }
}

async function loadClassesTable() {
  try {
    const response = await fetch("http://localhost:5002/api/classe/all");
    const data = await response.json();

    const tbody = document.querySelector("#classesTable tbody");
    tbody.innerHTML = "";

    if (data.data.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Aucune classe enregistrée</td>
                </tr>
            `;
      return;
    }

    data.data.forEach((classe) => {
      tbody.innerHTML += `
                <tr>
                    <td>${classe.classId}</td>
                    <td>${classe.name}</td>
                    <td class="action-buttons">
                        <button class="btn-edit" onclick="editClass('${classe._id}')">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="btn-delete" onclick="deleteClass('${classe._id}')">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Erreur lors du chargement des classes:", error);
  }
}

// Ajouter les écouteurs d'événements
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("classForm")
    .addEventListener("submit", handleClassSubmit);
  loadClassesTable(); // Charger les classes au démarrage
});

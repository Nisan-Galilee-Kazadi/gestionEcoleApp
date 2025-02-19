const Eleve = require('../models/Eleve'); // Assurez-vous que le modèle est bien importé

// Obtenir tous les élèves
exports.getEleves = async (req, res) => {
    try {
        const eleves = await Eleve.find();
        res.json(eleves);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Obtenir un élève par ID
exports.getEleveById = async (req, res) => {
    try {
        const eleve = await Eleve.findById(req.params.id);
        if (!eleve) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        res.json(eleve);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Ajouter un élève
exports.addEleve = async (req, res) => {
    try {
        const { name, class: className, email, phone } = req.body;
        const newEleve = new Eleve({ name, class: className, email, phone });
        await newEleve.save();
        res.status(201).json(newEleve);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Modifier un élève
exports.modifyEleve = async (req, res) => {
    try {
        const eleve = await Eleve.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!eleve) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        res.json(eleve);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer un élève
exports.deleteEleve = async (req, res) => {
    try {
        const eleve = await Eleve.findByIdAndDelete(req.params.id);
        if (!eleve) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        res.json({ message: "Élève supprimé avec succès" });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
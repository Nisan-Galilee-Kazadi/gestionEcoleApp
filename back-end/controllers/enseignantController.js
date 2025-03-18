const Enseignant = require('../models/Enseignant'); // Assurez-vous que le modèle est bien importé

// Obtenir tous les enseignants
exports.getEnseignant = async (req, res) => {
    try {
        const enseignants = await Enseignant.find();
        res.json(enseignants);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Obtenir un enseignant par ID
exports.getEnseignantById = async (req, res) => {
    try {
        const enseignant = await Enseignant.findById(req.params.id);
        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }
        res.json(enseignant);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Ajouter un enseignant
exports.addEnseignant = async (req, res) => {
    try {
        const { name, subject, email, phone } = req.body;
        const newEnseignant = new Enseignant({ name, subject, email, phone });
        await newEnseignant.save();
        res.status(201).json(newEnseignant);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Modifier un enseignant
exports.modifyEnseignant = async (req, res) => {
    try {
        const enseignant = await Enseignant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }
        res.json(enseignant);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer un enseignant
exports.deleteEnseignant = async (req, res) => {
    try {
        const enseignant = await Enseignant.findByIdAndDelete(req.params.id);
        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }
        res.json({ message: "Enseignant supprimé avec succès" });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les données du dashboard
exports.getDashboardData = async (req, res) => {
    try {
        const enseignantId = req.params.id;
        const enseignant = await Enseignant.findById(enseignantId);
        
        if (!enseignant) {
            return res.status(404).json({
                success: false,
                message: '❌ Enseignant non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            enseignant
        });

    } catch (error) {
        console.error('❌ Erreur dashboard:', error);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
};

// Récupérer l'horaire
exports.getHoraire = async (req, res) => {
    try {
        const enseignantId = req.params.id;
        const enseignant = await Enseignant.findById(enseignantId);
        
        if (!enseignant) {
            return res.status(404).json({
                success: false,
                message: '❌ Enseignant non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            horaire: enseignant.horaire
        });

    } catch (error) {
        console.error('❌ Erreur horaire:', error);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '❌ Aucune image fournie'
            });
        }

        const { id } = req.body;
        const enseignant = await Enseignant.findByIdAndUpdate(
            id,
            { photo: req.file.filename },
            { new: true }
        );

        if (!enseignant) {
            return res.status(404).json({
                success: false,
                message: '❌ Enseignant non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            filename: req.file.filename
        });

    } catch (err) {
        console.error('❌ Erreur upload photo:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
};
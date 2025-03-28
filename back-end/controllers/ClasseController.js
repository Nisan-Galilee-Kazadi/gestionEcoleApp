const Classe = require("../models/Classe");

exports.addClass = async (req, res) => {
  try {
    console.log("📥 Données reçues:", req.body);

    const newClasse = new Classe(req.body);
    await newClasse.save();

    console.log("✅ Classe créée:", newClasse);

    res.status(201).json({
      success: true,
      message: "Classe ajoutée avec succès",
      data: newClasse,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de l'ajout de la classe",
    });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.find().sort({ name: 1 });
    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des classes:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la récupération des classes",
    });
  }
};

exports.deleteClasse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClasse = await Classe.findByIdAndDelete(id);
    if (!deletedClasse) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Correction ici : ajoute `exports.` devant la fonction
exports.updateClasse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedClasse = await Classe.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedClasse) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    res.json(updatedClasse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

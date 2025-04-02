const Classe = require("../models/Classe");
const Option = require("../models/Option");
const Course = require("../models/Course");
const Fee = require("../models/Fee");

// Gestion des classes
exports.addClass = async (req, res) => {
  try {
    const { name, classId } = req.body;
    const newClass = new Classe({ name, classId });
    await newClass.save();
    res.status(201).json({
      success: true,
      message: "Classe ajoutée avec succès",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la classe: " + error.message,
    });
  }
};

// Gestion des options
exports.addOption = async (req, res) => {
  try {
    const { name, optionId } = req.body;

    // Vérifier si l'optionId existe déjà
    const existingOption = await Option.findOne({ optionId });
    if (existingOption) {
      return res.status(400).json({
        success: false,
        message: `L'option avec l'ID ${optionId} existe déjà`,
      });
    }

    const newOption = new Option({ name, optionId });
    await newOption.save();

    res.status(201).json({
      success: true,
      message: "Option ajoutée avec succès",
      data: newOption,
    });
  } catch (error) {
    // Message d'erreur plus convivial
    let errorMessage = "Erreur lors de l'ajout de l'option";
    if (error.code === 11000) {
      errorMessage = `L'option avec cet identifiant existe déjà`;
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Gestion des cours
exports.addCourse = async (req, res) => {
  try {
    const { name, courseId, class: classId, option } = req.body;

    const newCourse = new Course({
      name,
      courseId,
      class: classId,
      option: option !== "pas_necessaire" ? option : null,
    });

    const savedCourse = await newCourse.save();
    const populatedCourse = await Course.findById(savedCourse._id)
      .populate("class", "name")
      .populate("option", "name");

    res.status(201).json({
      success: true,
      message: "Cours ajouté avec succès",
      data: populatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Un cours avec cet ID existe déjà"
          : "Erreur lors de l'ajout du cours",
    });
  }
};

// Gestion des frais
exports.addFee = async (req, res) => {
  try {
    const { name, feeId, amount, currency, class: classId, option } = req.body;

    const newFee = new Fee({
      name,
      feeId,
      amount,
      currency: currency || "USD",
      class: classId,
      option: option !== "pas_necessaire" ? option : null,
    });

    const savedFee = await newFee.save();
    const populatedFee = await Fee.findById(savedFee._id)
      .populate("class", "name")
      .populate("option", "name");

    res.status(201).json({
      success: true,
      message: "Frais ajouté avec succès",
      data: populatedFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Un frais avec cet ID existe déjà"
          : "Erreur lors de l'ajout du frais",
    });
  }
};

// Récupérer toutes les options
exports.getAllOptions = async (req, res) => {
  try {
    const options = await Option.find().sort({ optionId: 1 });
    res.status(200).json({
      success: true,
      message: "Options récupérées avec succès",
      data: options,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des options: " + error.message,
    });
  }
};

// Supprimer une option
exports.deleteOption = async (req, res) => {
  try {
    const option = await Option.findByIdAndDelete(req.params.id);
    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Option non trouvée",
      });
    }
    res.status(200).json({
      success: true,
      message: "Option supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'option: " + error.message,
    });
  }
};

// Récupérer tous les frais
exports.getAllFees = async (req, res) => {
  try {
    console.log("Récupération des frais...");
    const fees = await Fee.find()
      .populate("class", "name")
      .populate("option", "name")
      .sort({ createdAt: -1 });

    console.log("Frais trouvés:", fees);

    res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.error("Erreur getAllFees:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des frais",
    });
  }
};

// Mettre à jour un frais
exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.option === "pas_necessaire") {
      updateData.option = null;
    }

    const updatedFee = await Fee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("class", "name")
      .populate("option", "name");

    if (!updatedFee) {
      return res.status(404).json({
        success: false,
        message: "Frais non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Frais mis à jour avec succès",
      data: updatedFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du frais",
    });
  }
};

// Supprimer un frais
exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFee = await Fee.findByIdAndDelete(id);

    if (!deletedFee) {
      return res.status(404).json({
        success: false,
        message: "Frais non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Frais supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du frais",
    });
  }
};

// Vérifier si un ID de frais existe déjà
exports.checkFeeId = async (req, res) => {
  try {
    const { feeId } = req.params;
    const existingFee = await Fee.findOne({ feeId });

    res.status(200).json({
      success: true,
      exists: !!existingFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de l'ID",
    });
  }
};

// Récupérer tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    console.log("Récupération des cours...");
    const courses = await Course.find()
      .populate("class", "name")
      .populate("option", "name")
      .sort({ createdAt: -1 });

    console.log("Cours trouvés:", courses);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Erreur getAllCourses:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des cours",
    });
  }
};

// Mettre à jour un cours
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.option === "pas_necessaire") {
      updateData.option = null;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("class", "name")
      .populate("option", "name");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cours mis à jour avec succès",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du cours",
    });
  }
};

// Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cours supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du cours",
    });
  }
};

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
    const newOption = new Option({ name, optionId });
    await newOption.save();
    res.status(201).json({
      success: true,
      message: "Option ajoutée avec succès",
      data: newOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'option: " + error.message,
    });
  }
};

// Gestion des cours
exports.addCourse = async (req, res) => {
  try {
    const { name, courseId } = req.body;
    const newCourse = new Course({ name, courseId });
    await newCourse.save();
    res.status(201).json({
      success: true,
      message: "Cours ajouté avec succès",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du cours: " + error.message,
    });
  }
};

// Gestion des frais
exports.addFee = async (req, res) => {
  try {
    const { name, feeId, amount } = req.body;
    const newFee = new Fee({ name, feeId, amount });
    await newFee.save();
    res.status(201).json({
      success: true,
      message: "Frais ajoutés avec succès",
      data: newFee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout des frais: " + error.message,
    });
  }
};

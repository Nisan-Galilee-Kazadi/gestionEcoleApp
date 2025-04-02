const express = require("express");
const router = express.Router();
const insertionController = require("../controllers/insertionController");
const Fee = require("../models/Fee");

// Routes pour l'insertion
router.post("/classes", insertionController.addClass);
router.post("/options", insertionController.addOption);
router.post("/courses", insertionController.addCourse);
router.post("/fees", insertionController.addFee);

// Route pour récupérer toutes les options
router.get("/options", insertionController.getAllOptions);
router.delete("/options/:id", insertionController.deleteOption);

// Routes pour les frais
router.get("/fees", insertionController.getAllFees);
router.post("/fees", insertionController.addFee);
router.put("/fees/:id", insertionController.updateFee);
router.delete("/fees/:id", insertionController.deleteFee);

// Route pour vérifier l'existence d'un ID
router.get("/fees/check/:feeId", insertionController.checkFeeId);

// Routes pour les cours
router.get("/courses", insertionController.getAllCourses);
router.post("/courses", insertionController.addCourse);
router.put("/courses/:id", insertionController.updateCourse);
router.delete("/courses/:id", insertionController.deleteCourse);

// Route de test pour vérifier si le routeur fonctionne
router.get("/test", (req, res) => {
  res.json({ message: "Routeur insertion fonctionne" });
});

module.exports = router;

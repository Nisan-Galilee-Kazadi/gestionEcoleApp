const express = require("express");
const router = express.Router();
const classeController = require("../controllers/ClasseController");

// Routes pour les classes
router.post("/add", classeController.addClass);
router.get("/all", classeController.getAllClasses);
router.put("/:id", classeController.updateClasse);
router.delete("/:id", classeController.deleteClasse);

// Ajoutez vos routes ici...

module.exports = router;

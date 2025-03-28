const express = require("express");
const router = express.Router();
const insertionController = require("../controllers/insertionController");

// Routes pour l'insertion
router.post("/classes", insertionController.addClass);
router.post("/options", insertionController.addOption);
router.post("/courses", insertionController.addCourse);
router.post("/fees", insertionController.addFee);

module.exports = router;

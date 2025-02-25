const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const Event = require('../models/Event');

router.post('/', eventController.createEvent);
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json({
      status: 'success',
      data: events
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
router.get('/:id', eventController.getEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Obtenir tous les événements
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un nouvel événement
router.post('/', async (req, res) => {
  try {
    console.log("Données reçues:", req.body); // Pour debug

    const event = new Event({
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      color: req.body.color
    });

    const newEvent = await event.save();
    console.log("Événement enregistré:", newEvent); // Pour debug
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Erreur d'enregistrement:", error); // Pour debug
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
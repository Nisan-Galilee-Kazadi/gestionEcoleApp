const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Gestion des événements récurrents
    if (eventData.isRecurrent) {
      const events = generateRecurrentEvents(eventData);
      const savedEvents = await Event.insertMany(events);
      res.status(201).json({ status: 'success', data: savedEvents });
    } else {
      const event = new Event(eventData);
      const savedEvent = await event.save();
      res.status(201).json({ status: 'success', data: savedEvent });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({
      status: 'success',
      data: events
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Événement non trouvé'
      });
    }
    res.status(200).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ status: 'success', data: event });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.json({ status: 'success', message: 'Événement supprimé' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ status: 'success', data: events });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Fonction utilitaire pour générer les événements récurrents
function generateRecurrentEvents(eventData) {
  const events = [];
  const startDate = new Date(eventData.date);
  const endDate = new Date(eventData.recurrenceEndDate);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    events.push({
      ...eventData,
      date: new Date(currentDate),
      isRecurrent: true
    });
    
    switch (eventData.recurrencePattern) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }
  
  return events;
}
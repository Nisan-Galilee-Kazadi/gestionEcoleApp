const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Récupérer tous les événements
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ status: { $ne: 'cancelled' } });
        console.log('📅 Envoi événements:', events);
        res.status(200).json(events);
    } catch (err) {
        console.error('❌ Erreur récupération événements:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

// Ajouter un événement
router.post('/', async (req, res) => {
    try {
        const { 
            title, 
            date, 
            time, 
            description, 
            category,
            color,
            isRecurrent,
            recurrencePattern,
            recurrenceEndDate,
            notifications,
            status
        } = req.body;
        
        const event = new Event({
            title,
            date: new Date(date),
            time,
            description,
            category,
            color,
            isRecurrent,
            recurrencePattern,
            recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null,
            notifications,
            status
        });

        await event.save();
        console.log('✅ Événement ajouté:', event);

        res.status(201).json({
            success: true,
            event
        });
    } catch (err) {
        console.error('❌ Erreur ajout événement:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur: ' + err.message
        });
    }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
    try {
        if (req.body.date) {
            req.body.date = new Date(req.body.date);
        }
        if (req.body.recurrenceEndDate) {
            req.body.recurrenceEndDate = new Date(req.body.recurrenceEndDate);
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: '❌ Événement non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (err) {
        console.error('❌ Erreur modification événement:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur: ' + err.message
        });
    }
});

// Annuler un événement
router.patch('/:id/cancel', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: '❌ Événement non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Événement annulé avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur annulation événement:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

// Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: '❌ Événement non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Événement supprimé avec succès'
        });
    } catch (err) {
        console.error('❌ Erreur suppression événement:', err);
        res.status(500).json({
            success: false,
            message: '❌ Erreur serveur'
        });
    }
});

module.exports = router;
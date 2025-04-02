const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['reunion', 'cours', 'examen', 'conge', 'autre'],
    default: 'autre'
  },
  color: { 
    type: String, 
    default: '#b88f1e' 
  },
  isRecurrent: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
    default: 'none'
  },
  recurrenceEndDate: {
    type: Date
  },
  notifications: [{
    type: String,
    enum: ['30min', '1hour', '1day', '1week'],
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  cost: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'CDF'],
      default: 'USD'
    }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Event', eventSchema);
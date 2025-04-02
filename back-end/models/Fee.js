const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du frais est requis']
    },
    feeId: {
      type: String,
      required: [true, 'L\'ID du frais est requis'],
      unique: true
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: [0, 'Le montant doit être positif']
    },
    currency: {
      type: String,
      enum: ['USD', 'CDF'],
      default: 'USD'
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classe',
      required: [true, 'La classe est requise']
    },
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);

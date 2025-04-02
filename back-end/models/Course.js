const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du cours est requis']
    },
    courseId: {
      type: String,
      required: [true, 'L\'ID du cours est requis'],
      unique: true
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classe',
      required: [true, 'La classe est requise']
    },
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
      default: null  // Permettra de mettre "pas_necessaire"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

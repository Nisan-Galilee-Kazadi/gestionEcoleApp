const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    optionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Option", optionSchema);

const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    feeId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);

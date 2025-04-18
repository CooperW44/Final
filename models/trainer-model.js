const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: v => /\.(jpg|jpeg|png)$/i.test(v),
      message: "Image must be .jpg, .jpeg, or .png"
    }
  },
  expertise: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Trainer", trainerSchema);

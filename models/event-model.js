const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  summary: { type: String, required: true, maxlength: 350 },
  image: {
    type: String,
    required: true,
    validate: {
      validator: v => /\.(jpg|jpeg|png)$/i.test(v),
      message: "Image must be .jpg, .jpeg, or .png"
    }
  },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Event", eventSchema);

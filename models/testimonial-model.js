const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  testimonial: { type: String, required: true },
  image: {
    type: String,
    validate: {
      validator: v => /\.(jpg|jpeg|png)$/i.test(v),
      message: "Image must be .jpg, .jpeg, or .png"
    }
  }
});

module.exports = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);

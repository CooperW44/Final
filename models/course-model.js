const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  image: {
    type: String,
    required: true,
    validate: {
      validator: v => /\.(jpg|jpeg|png)$/i.test(v),
      message: "Image must be .jpg, .jpeg, or .png"
    }
  },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  registrants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  schedule: { type: String },
  likes: { type: Number, default: 0 },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  slug: { type: String }
});

courseSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, trim: true });
  next();
});

module.exports = mongoose.model("Course", courseSchema);

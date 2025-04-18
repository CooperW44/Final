const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  response: { type: String, default: null },
  responseDate: { type: Date, default: null }
});

module.exports = mongoose.model("Contact", contactSchema);

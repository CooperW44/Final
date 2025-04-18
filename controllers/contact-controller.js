const Contact = require("../models/contact-model");
const { sendResponseEmail } = require("../util/mailer");

exports.getContact = (req, res) => {
  res.render("contact", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.getThanks = (req, res) => {
  res.render("thanks", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.postContact = async (req, res, next) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });
    await contact.save();
    res.redirect("/contacts/thanks");
  } catch (err) {
    console.error(err);
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
      errorMessage: "An error occurred, please try again.",
      formData: req.body,
    });
  }
};

exports.getUnrespondedContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ response: null }).sort({ postDate: -1 });
    res.render("contact-list", {
      pageTitle: "Unresponded Contacts",
      pageClass: "admin-contact-list",
      contacts
    });
  } catch (err) {
    next(err);
  }
};

exports.getRespondForm = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      req.flash("error", "Contact not found.");
      return res.redirect("/contacts/admin/list");
    }
    res.render("contact-respond", {
      pageTitle: "Respond to Contact",
      pageClass: "admin-contact-respond",
      contact
    });
  } catch (err) {
    next(err);
  }
};


exports.postRespond = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      {
        response: req.body.response,
        responseDate: new Date(),
      },
      { new: true }
    );

    await sendResponseEmail(contact.email, `Re: ${contact.subject}`, contact.response);

    req.flash("success", "Response submitted and email sent.");
    res.redirect("/contacts/admin/list");
  } catch (err) {
    next(err);
  }
};

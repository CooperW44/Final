const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/new", contactController.getContact);
router.post("/create", contactController.postContact);
router.get("/thanks", contactController.getThanks);
router.get("/admin/list", isAdmin, contactController.getUnrespondedContacts);
router.get("/admin/respond/:contactId", isAdmin, contactController.getRespondForm);
router.post("/admin/respond/:contactId", isAdmin, contactController.postRespond);


module.exports = router;

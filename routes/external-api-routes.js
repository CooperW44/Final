const express = require("express");
const router = express.Router();
const controller = require("../controllers/external-api-controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/externalapi", isAdmin, controller.getLacrosseData);

module.exports = router;

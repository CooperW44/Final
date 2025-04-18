const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/assets/img'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", courseController.getCourses);
router.get("/:slug", courseController.getCourseDetails);
router.get("/admin/create", isAdmin, courseController.getCreateCourseForm);
router.post("/admin/create", isAdmin, upload.single("image"), courseController.postCreateCourse);

router.get("/admin/:courseId/edit", isAdmin, courseController.getEditCourseForm);
router.post("/admin/:courseId/edit", isAdmin, upload.single("image"), courseController.postEditCourse);
router.post("/admin/:courseId/delete", isAdmin, courseController.postDeleteCourse);

router.get("/:courseId/register", courseController.getRegisterForm);
router.post("/register", courseController.postRegister);
router.post("/:courseId/unregister", courseController.postUnregister);

module.exports = router;

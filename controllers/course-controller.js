const Course = require("../models/course-model");
const User = require("../models/user-model");
const Trainer = require("../models/trainer-model");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer").populate("registrants");
    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseDetails = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).populate("trainer").populate("registrants");
    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course,
    });
  } catch (err) {
    next(err);
  }
};

exports.getRegisterForm = async (req, res, next) => {
  try {
    const courses = await Course.find();
    const selectedCourseId = req.params.courseId;
    res.render("register", {
      pageTitle: "Register for Course",
      pageClass: "register-page",
      courses,
      selectedCourseId,
      user: req.session.user,
    });
  } catch (err) {
    next(err);
  }
};

exports.postRegister = async (req, res, next) => {
  const courseId = req.body.courseId;
  const userId = req.session.user._id;

  try {
    const course = await Course.findById(courseId).populate("registrants");
    const user = await User.findById(userId);

    if (!course || !user) {
      req.flash("error", "Invalid course or user.");
      return res.redirect("/courses");
    }

    const alreadyRegistered = course.registrants.some(
      registrant => registrant._id.toString() === userId.toString()
    );

    if (alreadyRegistered) {
      req.flash("error", "You are already registered for this course.");
      return res.redirect("/courses");
    }

    if (course.registrants.length >= course.capacity) {
      req.flash("error", "Course is full.");
      return res.redirect("/courses");
    }

    course.registrants.push(user._id);
    user.courses.push(course._id);

    await course.save();
    await user.save();

    req.flash("success", "You have successfully registered for the course!");
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

exports.postUnregister = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.session.user._id;

  try {
    await Course.findByIdAndUpdate(courseId, { $pull: { registrants: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });

    req.flash("success", "You have been unregistered from the course.");
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

exports.getTopCoursesByLikes = async (limit) => {
  try {
    return await Course.find().sort({ likes: -1 }).limit(limit).populate("trainer");
  } catch (err) {
    console.error("Error in getTopCoursesByLikes:", err);
    return [];
  }
};

exports.getCreateCourseForm = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();
    res.render("create-course", {
      pageTitle: "Create Course",
      pageClass: "create-course-page",
      trainers
    });
  } catch (err) {
    next(err);
  }
};

exports.postCreateCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, trainer, schedule } = req.body;
    const image = req.file.filename;

    const newCourse = new Course({
      title,
      summary,
      description,
      price,
      capacity,
      trainer,
      schedule,
      image
    });

    await newCourse.save();
    req.flash("success", "Course created successfully.");
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

exports.getEditCourseForm = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const trainers = await Trainer.find();

    if (!course) {
      req.flash("error", "Course not found.");
      return res.redirect("/courses");
    }

    res.render("edit-course", {
      pageTitle: "Edit Course",
      pageClass: "edit-course-page",
      course,
      trainers
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { title, summary, description, price, capacity, trainer, schedule } = req.body;

    const updateData = {
      title,
      summary,
      description,
      price,
      capacity,
      trainer,
      schedule
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Course.findByIdAndUpdate(courseId, updateData);
    req.flash("success", "Course updated successfully.");
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

exports.postDeleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    await Course.findByIdAndDelete(courseId);
    await User.updateMany({}, { $pull: { courses: courseId } });

    req.flash("success", "Course deleted successfully.");
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

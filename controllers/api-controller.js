const Course = require("../models/course-model");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your-secret-key";

exports.getToken = (req, res) => {
  const token = jwt.sign({}, SECRET_KEY, { expiresIn: "24h" });
  res.json({ token });
};

exports.verifyToken = (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: "Token is required" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    next();
  });
};

exports.getCourses = async (req, res, next) => {
    try {
      const courses = await Course.find().populate("trainer");
  
      const baseUrl = `${req.protocol}://${req.get("host")}`;
  
      const sanitized = courses.map(course => {
        const { registrants, __v, ...rest } = course.toObject();
        return {
          ...rest,
          image: `${baseUrl}/assets/img/${course.image}`
        };
      });
  
      res.json(sanitized);
    } catch (err) {
      console.error("Error retrieving courses:", err);
      next(err);
    }
  };
  

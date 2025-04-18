const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const dotenv = require("dotenv");
dotenv.config();

const requestLogger = require("./middleware");

const homeRoutes = require("./routes/home-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");
const apiRoutes = require("./routes/api-routes");
const externalRoutes = require('./routes/external-routes');
const externalApiRoutes = require("./routes/external-api-routes");

const errorController = require('./controllers/error-controller');

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
store.on("error", err => console.error("Session store error:", err));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.currentUser = req.session.user;
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});

app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);
app.use("/contacts", contactRoutes);
app.use("/auth", userRoutes);
app.use("/", homeRoutes);
app.use("/api", apiRoutes);
app.use('/', externalRoutes);
app.use(externalApiRoutes);

app.use(errorController.get404);
app.use((err, req, res, next) => {
  errorController.get500(err, req, res, next);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("MongoDB connection failed:", err));

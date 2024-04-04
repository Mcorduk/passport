const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoDB = "mongodb://localhost:27017/express-auth";
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.get("/register", (req, res) => res.render("sign-up-form"));
// app.get("/login", (req, res) => res.render("login"));
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));

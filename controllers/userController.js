const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const PRIVATE_MSG = "THISISMYKINDOMCOME";

exports.isUserAuthenticated = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, PRIVATE_MSG);
    console.log(req.apiUser);
    next();
  } catch (err) {
    res.status(400).json({ message: "Authentication error", error: err });
  }
};

exports.register = async function (req, res) {
  const { email, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({ email, password: hash });
    await user.save();

    res.status(201).json({ user, message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const token = jwt.sign({ _id: user._id }, PRIVATE_MSG, { expiresIn: "3h" });

    if (user && (await bcrypt.compare(password, user.password))) {
      res
        .status(201)
        .json({ data: { user, token }, message: "User found successfully" });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};

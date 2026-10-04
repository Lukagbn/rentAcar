const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const verifyToken = require("../middleware/authMiddleware.js");

router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Wrong email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong email or password!" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, surname, nickname, email, phone, password, gender } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      surname,
      nickname,
      email,
      phone,
      gender,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/me", verifyToken, async (req, res) => {
  try {
    const { name, surname, email } = req.body;
    if (name === undefined && surname === undefined && email === undefined) {
      return res
        .status(400)
        .json({ error: "At least one field should be entered!" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (surname !== undefined) updateData.surname = surname;
    if (email !== undefined) updateData.email = email;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

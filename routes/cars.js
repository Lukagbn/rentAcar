const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Car = require("../models/Car.js");

router.get("/", async (req, res) => {
  try {
    const car = await Car.find();
    res.status(200).json({ carData: car });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      images,
      thumbnail_img,
      price,
      discount,
      car_type,
      transmission,
      fuel_type,
      fuel,
    } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      images,
      thumbnail_img,
      price,
      discount,
      car_type,
      transmission,
      fuel_type,
      fuel,
    });
    await newCar.save();
    res.status(200).json({ newCar: newCar });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;

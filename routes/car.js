const express = require("express");
const router = express.Router();
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

router.get("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const carDetails = await Car.findById(_id);
    if (!carDetails) {
      res.status(400).json({ message: "Wrong car id!" });
    }
    res.status(200).json({ carDetails });
  } catch (error) {
    console.log("error", error);
  }
});
module.exports = router;

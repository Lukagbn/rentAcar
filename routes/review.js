const express = require("express");
const router = express.Router();
const Review = require("../models/Review.js");
const Car = require("../models/Car.js");
const User = require("../models/User.js");

router.get("/", async (req, res) => {
  try {
    const allReviews = await Review.find();
    res.status(200).json({ allReviews: allReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/top", async (req, res) => {
  try {
    const allReviews = await Review.find();
    const topReviews = allReviews.filter((review) => review.rating === 5);
    res.status(200).json({ allReviews: topReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:carId", async (req, res) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ carId });
    res.status(200).json({ reviews: reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { rating, comment, userId, carId } = req.body;
    const user = await User.findById(userId);
    const newReview = new Review({
      rating,
      comment,
      userId,
      carId,
      userName: user.userName,
    });
    await newReview.save();

    const carReviews = await Review.find({
      carId: carId,
    });

    const totalScore = carReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating = totalScore / carReviews.length;

    const roundedRating = Math.round(averageRating * 10) / 10;

    await Car.findByIdAndUpdate(carId, {
      rating: roundedRating,
    });

    res.status(200).json({ review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

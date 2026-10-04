const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 4000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const carRoute = require("./routes/car");
const reviewRoute = require("./routes/review");
const authRoute = require("./routes/user");

app.use("/cars", carRoute);
app.use("/review", reviewRoute);
app.use("/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongoose running"))
  .catch((error) => console.log("error:", error));

app.listen(PORT, () => {
  console.log(`Listening to port, PORT:${PORT}`);
});

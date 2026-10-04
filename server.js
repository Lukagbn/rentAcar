const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

require("dotenv").config();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongoose running"))
  .catch((error) => console.log("error:", error));

app.listen(PORT, () => {
  console.log(`Listening to port, PORT:${PORT}`);
});

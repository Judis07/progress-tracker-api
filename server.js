require("dotenv").config();

const PORT = process.env.APP_PORT || 9000;
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.DB_STRTING)
  .then(() => {
    app.listen(PORT, () => console.log("server is running on " + PORT));
  })
  .catch((err) => console.log(err));

app.use("/api/task", taskRoute);
app.use("/api/auth", userRoute);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const clientRoutes = require("./routes/Client");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/client", clientRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

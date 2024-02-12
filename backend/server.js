require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk mengurai JSON dari request body
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Route sederhana untuk testing server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

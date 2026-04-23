const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});
const authRoutes = require("./routes/authRoutes");

app.use("/api", authRoutes);

const itemRoutes = require("./routes/itemRoutes");

app.use("/api", itemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
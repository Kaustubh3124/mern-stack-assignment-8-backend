const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

dotenv.config({ path: "./.env" });
connectDB();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
}));

// --- Routes ---
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/tasks", taskRoutes);

// --- Error Handling ---
// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;

// Only listen on a port if we're in a non-serverless environment (i.e., local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening locally on http://localhost:${PORT}`.yellow.bold);
    });
}

// Export the app for serverless environments like Vercel
module.exports = app;
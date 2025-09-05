const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize database connection
connectDB();

const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Setup CORS - In production, you should restrict this to your frontend's domain
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
}));

// A simple health check route to confirm the API is running
app.get("/", (req, res) => {
  res.send("API is responsive");
});

// Hook up the main task routes
app.use("/api/tasks", taskRoutes);

// Handle 404 Not Found responses - this should be after all valid routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `The requested URL was not found: ${req.originalUrl}`,
  });
});

// Global error handler - this should be the last piece of middleware
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
});

const PORT = process.env.PORT || 5000;

// The app should only listen on a port when running locally
// Vercel (a serverless environment) will handle invoking the exported app
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`.yellow.bold);
    });
}

// Export the app for serverless environments
module.exports = app;

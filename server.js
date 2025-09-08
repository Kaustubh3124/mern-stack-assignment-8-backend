const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

dotenv.config({ path: "./.env" });
connectDB();

const app = express();


const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'https://mern-stack-assignment-8-frontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/tasks", taskRoutes);


app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});


app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening locally on http://localhost:${PORT}`.yellow.bold);
    });
}


module.exports = app;
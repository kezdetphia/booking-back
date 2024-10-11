require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Express app
const app = express();

// Allow requests from localhost:3000
const corsOptions = {
  origin: "https://booking-front-two.vercel.app", // Change this to your frontend URL in production
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow desired methods
  credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions));
// Middleware
// app.use(cors());
app.use(express.json());

// Log request paths and methods for debugging
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the PORT variable only once
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userRoutes = require("./routes/UserRoutes");
// const appointmentRoutes = require("./routes/AppointmentRoutes");
// const adminRoutes = require("./routes/AdminRoutes");

// // Express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// app.use("/api/users", userRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/admin", adminRoutes);
// // app.use("/", ProductRoutes);

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {})
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define the PORT variable
// const PORT = process.env.PORT || 5000;

// // Start the server
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/UserRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "frontend/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the PORT variable
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

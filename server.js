// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userRoutes = require("./routes/UserRoutes");
// const appointmentRoutes = require("./routes/AppointmentRoutes");
// const emailRoutes = require("./routes/EmailRoutes");
// const adminRoutes = require("./routes/AdminRoutes");

// // Express app
// const app = express();

// // Allow requests from localhost:3000
// // const corsOptions = {
// //   origin: "https://booking-front-two.vercel.app", // Change this to your frontend URL in production
// //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow desired methods
// //   credentials: true, // Allow credentials if needed
// // };
// // app.use(cors(corsOptions));

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Log request paths and methods for debugging
// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/email", emailRoutes);

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {})
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define the PORT variable only once
// const PORT = process.env.PORT || 3001;

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//impleneting websocket
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const userRoutes = require("./routes/UserRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const emailRoutes = require("./routes/EmailRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Express app
const app = express();

// CORS options to allow requests from frontend
const corsOptions = {
  origin: "http://localhost:3000", // Change this to your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Log request paths and methods
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to access WebSocket
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`); // Logs the socket ID

  socket.on("updateAppointment", (data) => {
    io.emit("appointmentUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

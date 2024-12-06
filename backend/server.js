require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const AuthRoutes = require("./routes/AuthRoutes");
const libraryRoutes = require("./routes/libraryRoutes");

// JSON parsing error handler
server.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body",
    });
  }
  next(err);
});

// Middleware must come BEFORE routes
server.use(express.json());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

server.use((err, req, res, next) => {
  console.error(err.stack); // Log the error details for debugging

  if (err.name === "ValidationError") {
    // Handle Mongoose validation errors
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors,
    });
  }

  if (err.name === "MongoServerError") {
    // Handle MongoDB-specific errors (e.g., duplicate key errors)
    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: err.message,
    });
  }

  // Generic error handling
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

server.use(libraryRoutes);

// Static files
server.use("/uploads", express.static("uploads"));
server.use(express.static(path.join(__dirname, "public")));
// ROUTES
server.use(AuthRoutes);
const { mongoConnect } = require("./util/database");

async function startServer() {
  try {
    await mongoConnect();
    server.listen(4000, () => {
      console.log("Backend server running on localhost:4000");
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  if (req.xhr || req.path.startsWith("/api")) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } else {
    res.status(500).render("error", {
      message: "Something went wrong!",
    });
  }
});

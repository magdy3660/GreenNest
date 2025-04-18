require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const registerServiceRoutes = require("./routes/serviceRoutes");

const registerLibraryRoutes = require("./routes/libraryRoutes");

const { mongoConnect } = require("./util/database");

async function startServer() {
  try {
    const app = express();

    // Middleware must come BEFORE routes
    app.use(express.json());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    await mongoConnect();

    const router = express.Router()
    registerLibraryRoutes(router)
    registerServiceRoutes(router)

    app.use(router)
    
    // Static files
    app.use("/uploads", express.static("uploads"));
    app.use(express.static(path.join(__dirname, "public")));

    app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in request body",
        });

      } else if (err.name === "MongoServerError") {
        // Handle MongoDB-specific errors (e.g., duplicate key errors)
        return res.status(500).json({
          success: false,
          message: "Database Error",
          error: err.message,
        });
      } else if (err.name === "ValidationError") {
        // Handle Mongoose validation errors
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: err.errors,
        });

      } else {
        console.log("FAILED: ", err)
      }

      next(err);
    });

    app.listen(4000, (err) => {
      console.log("[+] Backend server at localhost:4000");
    });

  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();

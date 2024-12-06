const plantController = require("../controllers/plantController");
const authController = require("../controllers/authController");
const uploadScanController = require("../controllers/upload&scanController");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public routes
router.post("/api/v1/register", authController.register);
router.post("/api/v1/login", authController.login);
router.get("/api/v1/verify-email", authController.verifyEmail);

router.post("/api/v1/forgot-password", authController.getResetPasswordToken);
router.post("/api/v1/reset-password", authController.resetPassword);

// Protected routes (auth required)
router.use("/api/v1/users", auth); // Protect all user routes
router.post("/api/v1/users/:userId/logout", authController.logout);

router.post(
  "/api/v1/users/:userId/images",
  upload,
  uploadScanController.uploadImage
);

// Future endpoint for AI analysis
// router.post(
//   "/api/v1/users/:userId/images/analyze",
//   upload,
//   uploadScanController.confirmAndAnalyze
// );

router.get("/api/v1/users/:userId/dashboard", plantController.getDashboard);

// 404 handler
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = router;

const authController = require("../controllers/authController");
const ScanController = require("../controllers/ScanController");
const dashboardController = require("../controllers/dashController")
const upload2 = require("../middlewares/upload2"); //upload middleware
const auth = require("../middlewares/auth");

const registerAuthenticatedRoutes = (router) => { 
  router.post("/api/v1/register", authController.register);
  router.post("/api/v1/login", authController.login);
  router.get("/api/v1/verify-email", authController.verifyEmail);
  
  router.post("/api/v1/forgot-password", authController.getResetPasswordToken);
  router.post("/api/v1/reset-password", authController.resetPassword);
  
  // Protected routes (auth required)
  router.use("/api/v1/users", auth); // Protect all user routes
  router.post("/api/v1/users/:userId/logout", authController.logout);
  router.get("/api/v1/users/:userId/dashboard", dashboardController.getDashboard);
  
  router.post("/api/v1/users/:userId/scan/analzye",upload2, ScanController.sendForDetection);
  router.post("/api/v1/users/:userId/scan/history/save",upload2, ScanController.saveToHistory);
  router.get("/api/v1/users/:userId/scan/history",ScanController.getHistory);
  router.get("/api/v1/users/:userId/scan/history/:historyId",ScanController.getHistoryEntry);
}

module.exports = registerAuthenticatedRoutes;

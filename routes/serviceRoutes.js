const authController = require("../controllers/authController");
const ScanController = require("../controllers/ScanController");
const profileController = require("../controllers/profileController");
const upload2 = require("../middlewares/upload2"); //upload middleware
const profileUpload = require("../middlewares/profileUpload");
const auth = require("../middlewares/auth");

const registerAuthenticatedRoutes = (router) => { 

  router.get("/api/v1/verify-email", authController.verifyEmail);


  // Auth routes
  router.post("/api/v1/register", authController.register);
  router.post("/api/v1/login", authController.login);


  
  router.post("/api/v1/forgot-password", authController.getResetPasswordToken);
  router.post("/api/v1/reset-password", authController.resetPassword);
  
  
  router.use("/api/v1/users", auth);   // Protect all user routes


    // scans
  router.post("/api/v1/users/:userId/scans",upload2, ScanController.sendForDetection);   

  router.post("/api/v1/users/:userId/scans/remediations", ScanController.getRemediation);  

    // user profile
  router.patch("/api/v1/users/:userId/profile",profileUpload, profileController.updateProfile);

  router.get("/api/v1/users/:userId/profile", profileController.getProfile);
  router.post("/api/v1/users/:userId/logout", authController.logout); 


    // histories
  router.post("/api/v1/users/:userId/histories", ScanController.saveToScans);
  router.get("/api/v1/users/:userId/histories",ScanController.getAllScans);
  router.get("/api/v1/users/:userId/histories/:historyId",ScanController.getScanEntity);


    // DASHBOARD (scans + histories)
  router.get("/api/v1/users/:userId/dashboard", profileController.getDashboard);  




}

module.exports = registerAuthenticatedRoutes;

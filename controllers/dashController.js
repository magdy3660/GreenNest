const DBService = require("../services/DB_service");

exports.getDashboard = async (req, res) => {
  const cookieId = req.userId
  const userId = req.params.userId
  if (cookieId!= userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access"
    });
  }
  try {
    // Use the authenticated user's ID from the request object
    console.log('Fetching dashboard data for user:', userId);
    const userDetails = await DBService.getUserDetails(userId)
    const previousScans = await DBService.getHistory(userId);
    console.log('Retrieved histories:', previousScans ? previousScans.length : 0, 'entries');
    
    res.status(200).json({ success: true, userDetails, previousScans });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  } 
  }
const DBService = require("../services/DB_service");

exports.getDashboard = async (req, res) => {
  const userId = req.userId;
  try {
    // Use the authenticated user's ID from the request object
    console.log('Fetching dashboard data for user:', userId);
    
    const histories = await DBService.getHistory(userId);
    console.log('Retrieved histories:', histories ? histories.length : 0, 'entries');
    
    res.status(200).json({ success: true, histories });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  } 
  }
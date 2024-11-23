const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};


exports.getLogin = async (req, res) => { res.status(200).json({message:'login page fetched'})}




exports.getDashboard = async (req, res) => {
    
         // GET USER INFO FROM DB
         try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }


            const userPlants = await PlantTracking.find({ user_id: user._id })
            .limit(3)  // Only get 3 most recent plants
            .sort({ createdAt: -1 });  
                    console.log('Dashboard plants that are associated with the user' +userPlants)
            
                res.status(200).json({
                user: {...user},
                dashboardPlants: userPlants
            })

          } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({ message: 'Error fetching Dashboard' });
          }
}

exports.getTracking= async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
//  const userPlants = //get plants from TRACKING
        const userPlants = await PlantTracking.find({ user_id: user._id });
                console.log(' Tracked PLants  that are associated with the user' +userPlants)
        
            res.status(200).json({
            user: {...user},
            plants: userPlants
        })

      } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Error fetching Dashboard' });
      }

}



exports.getHistory = async (req, res) => {
    const scanHistory = [
        {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'healthy' },
        {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'Unhealthy', diseaseName: "Leaf BLight" },
    ]
    res.status(200).json(scanHistory)
}
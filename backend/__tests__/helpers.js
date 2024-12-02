const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');

// Create test user and return auth token
const createTestUser = async () => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );

  return { user, token };
};

// Get test image path
const getTestImagePath = () => {
  return path.join(__dirname, 'fixtures', 'test-plant.jpg');
};

// Create test plant data
const createTestPlantData = () => {
  return {
    name: 'Test Plant',
    type: 'Indoor',
    location: 'Living Room'
  };
};

module.exports = {
  createTestUser,
  getTestImagePath,
  createTestPlantData
};

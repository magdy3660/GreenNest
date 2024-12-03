const mongoose = require('mongoose');
require('dotenv').config();

// Connect to test database before running any tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/greennest_test';
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
}, 10000);

// Clear all test data after every test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}, 10000);

// Disconnect after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
}, 10000);

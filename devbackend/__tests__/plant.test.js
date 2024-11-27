const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');
const { createTestUser, getTestImagePath, createTestPlantData } = require('./helpers');

describe('Plant Management Tests', () => {
  let user, token, testImagePath;

  beforeAll(() => {
    testImagePath = getTestImagePath();
    // Create test image if it doesn't exist
    if (!fs.existsSync(testImagePath)) {
      const fixturesDir = path.dirname(testImagePath);
      if (!fs.existsSync(fixturesDir)) {
        fs.mkdirSync(fixturesDir, { recursive: true });
      }
      // Create a simple test image
      fs.writeFileSync(testImagePath, 'test image content');
    }
  });

  beforeEach(async () => {
    const testData = await createTestUser();
    user = testData.user;
    token = testData.token;
  });

  describe('POST /api/plants/track', () => {
    it('should track a new plant successfully', async () => {
      const res = await request(app)
        .post('/api/plants/track')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .field('location', 'Living Room')
        .attach('file', testImagePath);

      expect(res.status).toBe(201);
      expect(res.body.plant).toHaveProperty('name', 'Test Plant');
      expect(res.body.plant).toHaveProperty('type', 'Indoor');
      expect(res.body.plant).toHaveProperty('user', user._id.toString());
    });

    it('should not track plant without authentication', async () => {
      const res = await request(app)
        .post('/api/plants/track')
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .attach('file', testImagePath);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/plants', () => {
    it('should get all plants for authenticated user', async () => {
      // First add a plant
      await request(app)
        .post('/api/plants/track')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .attach('file', testImagePath);

      const res = await request(app)
        .get('/api/plants')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.plants)).toBeTruthy();
      expect(res.body.plants.length).toBe(1);
      expect(res.body.plants[0]).toHaveProperty('name', 'Test Plant');
    });
  });

  describe('GET /api/plants/:plantId', () => {
    let plantId;

    beforeEach(async () => {
      const plant = await request(app)
        .post('/api/plants/track')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .attach('file', testImagePath);

      plantId = plant.body.plant._id;
    });

    it('should get specific plant details', async () => {
      const res = await request(app)
        .get(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.plant).toHaveProperty('_id', plantId);
      expect(res.body.plant).toHaveProperty('name', 'Test Plant');
    });

    it('should not get plant with invalid ID', async () => {
      const res = await request(app)
        .get('/api/plants/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/plants/:plantId/scan', () => {
    let plantId;

    beforeEach(async () => {
      const plant = await request(app)
        .post('/api/plants/track')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .attach('file', testImagePath);

      plantId = plant.body.plant._id;
    });

    it('should add new scan to existing plant', async () => {
      const res = await request(app)
        .post(`/api/plants/${plantId}/scan`)
        .set('Authorization', `Bearer ${token}`)
        .attach('file', testImagePath);

      expect(res.status).toBe(200);
      expect(res.body.plant).toHaveProperty('_id', plantId);
      expect(res.body.plant.history.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/plants/:plantId', () => {
    let plantId;

    beforeEach(async () => {
      const plant = await request(app)
        .post('/api/plants/track')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Plant')
        .field('type', 'Indoor')
        .attach('file', testImagePath);

      plantId = plant.body.plant._id;
    });

    it('should delete plant successfully', async () => {
      const res = await request(app)
        .delete(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Plant deleted successfully');

      // Verify plant is deleted
      const getRes = await request(app)
        .get(`/api/plants/${plantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });
  });

  describe('GET /guest/scan', () => {
    it('should analyze plant without saving', async () => {
      const res = await request(app)
        .post('/api/guest/scan')
        .attach('file', testImagePath);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('analysis');
      expect(res.body.analysis).toHaveProperty('diagnosis');
    });
  });
});

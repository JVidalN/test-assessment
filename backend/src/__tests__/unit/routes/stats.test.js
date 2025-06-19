const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
const mockItems = require('../../../__mocks__/mockItems');

jest.mock('fs')

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Import stats route
  const itemsRouter = require('../../../routes/stats');
  app.use('/api/stats', itemsRouter);

  // Basic error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });

  return app;
};

describe('Stats API', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();

    fs.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.writeFile.mockResolvedValue();
  });

  const expectedResult = { "averagePrice": 1197, "total": 50 };

  //GET
  describe('GET /api/stats', () => {
    test('should return the stats', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toEqual(expectedResult);
    });
  });

});

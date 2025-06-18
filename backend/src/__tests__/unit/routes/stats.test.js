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

    fs.readFileSync.mockReturnValue(JSON.stringify(mockItems));
    fs.writeFileSync.mockImplementation(() => { });
  });

  //GET
  describe('GET /api/stats', () => {
    test('should return the stats', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveLength(5);
      expect(response.body[0]).toEqual(mockItems[0]);
    });
  });

});

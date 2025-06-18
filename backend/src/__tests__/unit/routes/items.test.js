const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const mockItems = require('../../../__mocks__/mockItems');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Import items route
  const itemsRouter = require('../../../routes/items');
  app.use('/api/items', itemsRouter);

  // Basic error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });

  return app;
};

describe('Items API', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();

    ///Mock the return
    fs.readFile.mockResolvedValue(JSON.stringify(mockItems));
    fs.writeFile.mockResolvedValue();
  });

  //GET
  describe('GET /api/items', () => {
    test('should return all items', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveLength(5);
      expect(response.body[0]).toEqual(mockItems[0]);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    test('should filter items by name', async () => {
      const response = await request(app)
        .get('/api/items?q=laptop')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(1);
    });

    test('should limit results', async () => {
      const response = await request(app)
        .get('/api/items?limit=2')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  //GET/:id
  describe('GET /api/items/:id', () => {
    test('should return item by id', async () => {
      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(response.body).toEqual(mockItems[0]);
    });

    test('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/items/1000')
        .expect(404);

      expect(response.body.error).toBe('Item not found');
    });
  });

  //POST
  describe('POST /api/items', () => {
    test('should create new item', async () => {
      const newItem = {
        "id": 1,
        "name": "Laptop Pro m3",
        "category": "Electronics",
        "price": 2499
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.category).toBe(newItem.category);
      expect(response.body.price).toBe(newItem.price);

      // Check if it tried to save into the file.
      expect(fs.writeFile).toHaveBeenCalled();
    });

    test('should handle file read error properly', async () => {
      fs.readFile.mockResolvedValue(() => {
        throw new Error();
      });

      await request(app)
        .get('/api/items')
        .expect(500);
    });
  });
});

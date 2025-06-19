const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH);
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, page, q } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    const total = results.length;

    //Handling pagination
    let paginatedResults = results;
    const limitNum = parseInt(limit) || 5;
    const pageNum = parseInt(page) || 1;

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    paginatedResults = results.slice(startIndex, endIndex);

    res.json({
      items: paginatedResults,
      total,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;

    // TODO: Validate payload (intentional omission)
    if (
      typeof item.name !== 'string' || item.name.trim() === '' ||
      typeof item.category !== 'string' || item.category.trim() === '' ||
      typeof item.price !== 'number' || item.price <= 0
    ) {
      return res.status(400).json({ error: 'Invalid payload. All fields are required!' });
    }

    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

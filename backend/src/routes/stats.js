const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const raw = await fs.readFile(DATA_PATH);
    const items = JSON.parse(raw);

    // Intentional heavy CPU calculation
    const stats = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    };

    res.json(stats);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

const express = require('express');
const fs = require('fs');
const fsSync = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let statsCache = null;
let isWatching = false;

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {

    // Initialize cache in the first request
    if (!isWatching) {
      await initializeCache();
    }

    // Return the stats cached
    if (statsCache) {
      //Returning the same structure and using the lastUpdated just as intern control.
      const { lastUpdated, ...stats } = statsCache;

      res.json(stats);
    } else {
      res.status(500).json({ error: 'Failed to load stats' });
    }

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

// Init cache and watcher
async function initializeCache() {
  if (isWatching) return;

  try {
    // Read initial data
    await updateCache();

    // Watching changes
    fsSync.watchFile(DATA_PATH, { interval: 1000 }, async (curr, prev) => {
      await updateCache();
    });

    isWatching = true;
  } catch (error) {
    console.error('Failed to initialize cache...', error);
  }
}

async function updateCache() {
  try {
    const raw = await fs.readFile(DATA_PATH);
    const items = JSON.parse(raw);

    //Calculate the stats
    statsCache = {
      total: items.length,
      averagePrice: items.length > 0 ? (items.reduce((acc, cur) => acc + cur.price, 0) / items.length) : 0,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error updating cache:', error);
    statsCache = null;
  }
}

module.exports = router;

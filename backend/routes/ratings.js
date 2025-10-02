const router = require('express').Router();
const db = require('../db');

router.route('/').get(async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ratings');
    res.json(rows);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  const { user_id, store_id, rating } = req.body;
  const newRating = { user_id, store_id, rating };
  try {
    await db.query('INSERT INTO ratings SET ?', newRating);
    res.json('Rating added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
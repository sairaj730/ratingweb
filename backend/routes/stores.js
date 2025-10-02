const router = require('express').Router();
const db = require('../db');

router.route('/').get(async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores');
    res.json(rows);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  const newStore = { name, email, address, owner_id };
  try {
    await db.query('INSERT INTO stores SET ?', newStore);
    res.json('Store added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
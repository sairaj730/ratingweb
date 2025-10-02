
import express from 'express';
const router = express.Router();
import db from '../db.js';
import { authenticateToken } from '../utils/auth.js';

router.route('/').get(authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ratings');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/add').post(authenticateToken, async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;
  const newRating = { user_id, store_id, rating };
  try {
    await db.query('INSERT INTO ratings SET ?', newRating);
    res.json('Rating added!');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/update').put(authenticateToken, async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;
  try {
    await db.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, user_id, store_id]);
    res.json('Rating updated!');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
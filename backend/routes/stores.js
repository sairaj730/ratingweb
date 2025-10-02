
import express from 'express';
const router = express.Router();
import db from '../db.js';
import { authenticateToken } from '../utils/auth.js';

router.route('/').get(authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, AVG(r.rating) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(authenticateToken, async (req, res) => {
  if (req.user.role !== 'System Administrator') {
    return res.sendStatus(403);
  }
  const { name, email, address, owner_id } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [owner_id]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Owner not found' });
    }
    const newStore = { name, email, address, owner_id };
    await db.query('INSERT INTO stores SET ?', newStore);
    res.json('Store added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

export default router;
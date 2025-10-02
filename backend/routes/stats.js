
import express from 'express';
const router = express.Router();
import db from '../db.js';

router.route('/').get(async (req, res) => {
  try {
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [stores] = await db.query('SELECT COUNT(*) as count FROM stores');
    const [ratings] = await db.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      users: users[0].count,
      stores: stores[0].count,
      ratings: ratings[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;


import express from 'express';
const router = express.Router();
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/auth.js';

router.route('/register').post(async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const allowedRoles = ['Normal User', 'Store Owner', 'System Administrator'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, address, role };
    await db.query('INSERT INTO users SET ?', newUser);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userPayload = { id: user.id, role: user.role };
      const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.json({ accessToken });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/update-password').put(authenticateToken, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

router.route('/').get(authenticateToken, async (req, res) => {
  if (req.user.role !== 'System Administrator') {
    return res.sendStatus(403);
  }
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.address, u.role, AVG(r.rating) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import usersRouter from './routes/users.js';
import storesRouter from './routes/stores.js';
import ratingsRouter from './routes/ratings.js';
import statsRouter from './routes/stats.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/stores', storesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/stats', statsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
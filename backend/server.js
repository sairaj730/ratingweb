const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const storesRouter = require('./routes/stores');
const ratingsRouter = require('./routes/ratings');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/stores', storesRouter);
app.use('/api/ratings', ratingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
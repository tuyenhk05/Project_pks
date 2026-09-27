const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend service initialized (Phase 0)' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

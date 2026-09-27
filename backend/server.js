const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/configs/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Kết nối cơ sở dữ liệu MongoDB
connectDB().catch((err) => {
  console.error('[Server] Không thể kết nối Database khi khởi động:', err.message);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend service initialized (Phase 1 Ready)'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

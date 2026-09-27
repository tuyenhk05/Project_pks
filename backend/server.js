const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

dotenv.config();

const connectDB = require('./src/configs/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Security Middlewares
app.use(helmet());

const clientUrl = process.env.CLIENT_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Cho phép clientUrl, local ports, và bất kỳ domain vercel.app nào
      if (
        origin === clientUrl ||
        origin === 'http://localhost:5173' ||
        origin === 'http://127.0.0.1:5173' ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting (100 requests / 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu từ IP của bạn, vui lòng thử lại sau 15 phút',
  },
});
app.use('/api/', limiter);
app.use('/admin/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PKS Course & Enrollment Portal API Server Running',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use(routes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;

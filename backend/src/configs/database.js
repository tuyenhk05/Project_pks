const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/pks_courses';
    const conn = await mongoose.connect(uri);

    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB connection error: ${error.message}`);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'College Notes API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'OK',
    database: dbStatus,
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Enhanced database connection
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`   Error: ${error.message}`);
    
    // Detailed error information
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n🔍 TROUBLESHOOTING MONGODB ATLAS:');
      console.log('   1. Check your IP is whitelisted in MongoDB Atlas');
      console.log('   2. Verify your username and password in connection string');
      console.log('   3. Ensure your cluster is running');
      console.log('   4. Check network connectivity');
      console.log('   5. Visit: https://cloud.mongodb.com → Network Access');
    }
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n🌐 NETWORK ISSUE:');
      console.log('   Check your internet connection');
    }
    
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🎉 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(' MongoDB connection closed through app termination');
  process.exit(0);
});

// Initialize connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📚 College Notes Platform API Ready!`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
});
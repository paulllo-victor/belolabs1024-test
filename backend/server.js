const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const memoryRoutes = require('./routes/memoryRoutes');

// Load environment variables
dotenv.config({ path: './config/.env' });

// Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Substitua pelo seu domínio em produção
    : ['http://localhost:5173', 'http://127.0.0.1:5173'], // Origens permitidas em desenvolvimento
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/memory', memoryRoutes);

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conecta ao MongoDB primeiro
    await connectDB();
    
    // Inicia o servidor apenas após a conexão bem-sucedida com o MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

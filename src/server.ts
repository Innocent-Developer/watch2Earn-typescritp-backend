import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbconnect';
import router from './routes/router';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Connect to database
connectDB();

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript Server!');
});

// Use API routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

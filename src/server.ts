import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbconnect';
import router from './routes/router';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

dotenv.config();
connectDB();
app.get('/', (_req, res) => {
  res.send('Hello from TypeScript Server!');
});
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

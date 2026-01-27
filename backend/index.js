import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
  res.json({ message: '✅ Backend CinéConnect OK' });
});

// Route API
app.get('/api', (req, res) => {
  res.json({ message: '✅ API CinéConnect OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
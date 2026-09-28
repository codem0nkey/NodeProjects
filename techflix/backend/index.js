const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URI = `mongodb://root:${encodeURIComponent(MONGO_PASSWORD)}@mongo-mongodb.default.svc.cluster.local:27017/techflix?authSource=admin`;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema Definition: Enable native Mongoose timestamps
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }
}, {
  timestamps: true // Mongoose automatically manages createdAt and updatedAt
});

const Article = mongoose.model('Article', articleSchema);

// GET /api/articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    const newArticle = new Article({ title, content, author });
    const savedArticle = await newArticle.save();

    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

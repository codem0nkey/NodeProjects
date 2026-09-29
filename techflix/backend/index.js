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

// Schema Definition with Tags & Timestamps
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], default: ['General'] }
}, {
  timestamps: true
});

// Full-Text Index on title, content, and tags
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Article = mongoose.model('Article', articleSchema);

// GET /api/articles (Fetch all articles sorted newest first)
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles/search (Dedicated MongoDB Text Search)
app.get('/api/articles/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const articles = await Article.find({
      $text: {$search: q }
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    // Process comma-separated tags or array
    let processedTags = ['General'];
    if (Array.isArray(tags) && tags.length > 0) {
      processedTags = tags.map(t => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      processedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const newArticle = new Article({ title, content, author, tags: processedTags });
    const savedArticle = await newArticle.save();

    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
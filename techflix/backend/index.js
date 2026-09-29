const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URI = `mongodb://root:${encodeURIComponent(MONGO_PASSWORD)}@mongo-mongodb.default.svc.cluster.local:27017/techflix?authSource=admin`;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 1. Schema definition
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], default: ['General'] }
}, {
  timestamps: true,
  strict: false
});

// Force-add tags to schema in case Mongoose cached a compiled version
articleSchema.add({ tags: { type: [String], default: ['General'] } });

// Clear cached models if re-registering
if (mongoose.models.Article) {
  delete mongoose.models.Article;
}

const Article = mongoose.model('Article', articleSchema);

// GET /api/articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles
app.post('/api/articles', async (req, res) => {
  try {
    console.log('Incoming POST body:', req.body);

    const { title, content, author, tags } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    // Process tags into array
    let parsedTags = ['General'];
    if (Array.isArray(tags) && tags.length > 0) {
      parsedTags = tags.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    if (parsedTags.length === 0) parsedTags = ['General'];

    // Use Article.create() with explicit object definition
    const savedArticle = await Article.create({
      title,
      content,
      author,
      tags: parsedTags
    });

    console.log('Saved document in DB:', savedArticle);
    res.status(201).json(savedArticle);
  } catch (err) {
    console.error('POST Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Helper function to generate a consistent tech image URL per article
// Curated list of specific technology / abstract / dark-themed image IDs from Picsum
const PICSUM_TECH_IDS = [
  0,    // Laptop / Workstation
  1,    // Laptop / Code workspace
  2,    // Laptop setup
  3,    // Devices / Workspace
  4,    // Laptop & Notebook
  6,    // Abstract dark tech
  7,
  8,
  180,  // Laptop / Workspace setup
  366,  // Abstract dark geometric
  445,  // Dark moody tech scene
  532,  // Hardware / Abstract dark
  1060, // Coffee & Code setup
];

const getArticleImage = (article) => {
  const str = article._id || article.title || 'tech';
  
  // Calculate a simple hash code from the ID or title string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Select a deterministic tech photo ID
  const index = Math.abs(hash) % PICSUM_TECH_IDS.length;
  const imageId = PICSUM_TECH_IDS[index];

  // Return crisp 600x350 thumbnail URL directly from Picsum
  return `https://picsum.photos/id/${imageId}/600/350`;
};

// Reusable Netflix-style Category Row with Image Cards
function CategoryRow({ category, articles, onSelectArticle, onTagClick, formatDate }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="category-row">
      <div className="category-header">
        <h2 className="category-title" onClick={() => onTagClick(category)}>
          {category} <span className="category-arrow">›</span>
        </h2>
      </div>
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => scroll('left')}>‹</button>
        <div className="slider-container" ref={rowRef}>
          {articles.map((art) => (
            <div key={art._id} className="card" onClick={() => onSelectArticle(art)}>
              <div className="card-image-container">
                <img 
                  src={getArticleImage(art)} 
                  alt={art.title} 
                  className="card-image"
                  loading="lazy" 
                />
                <div className="card-image-overlay"></div>
              </div>
              <div className="card-body">
                <div className="card-title">{art.title}</div>
                <div className="card-author">By {art.author} {art.createdAt && `• ${formatDate(art.createdAt)}`}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
}

// Multi-Article Hero Carousel with Dynamic Background Image
function HeroBanner({ articles, onSelectArticle, onTagClick, formatDate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredArticles = articles.slice(0, 4);

  useEffect(() => {
    if (featuredArticles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredArticles.length]);

  if (featuredArticles.length === 0) return null;

  const currentArticle = featuredArticles[currentIndex];
  const wordCount = currentArticle.content ? currentArticle.content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const bgImage = getArticleImage(currentArticle);

  return (
    <div 
      className="hero-featured" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="hero-overlay"></div>

      {featuredArticles.length > 1 && (
        <>
          <button 
            className="hero-nav-btn prev" 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length)}
            title="Previous Article"
          >
            ‹
          </button>
          <button 
            className="hero-nav-btn next" 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredArticles.length)}
            title="Next Article"
          >
            ›
          </button>
        </>
      )}

      <div className="hero-content" key={currentArticle._id}>
        <div className="hero-badge-featured">
          FEATURED ARTICLE ({currentIndex + 1}/{featuredArticles.length})
        </div>
        <h1 className="hero-title">{currentArticle.title}</h1>
        
        <div className="hero-meta">
          <span>By {currentArticle.author}</span>
          <span className="bullet">•</span>
          <span>{formatDate(currentArticle.createdAt)}</span>
          <span className="bullet">•</span>
          <span>{readTime} min read</span>
        </div>

        {Array.isArray(currentArticle.tags) && currentArticle.tags.length > 0 && (
          <div className="hero-tags">
            {currentArticle.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge clickable" onClick={() => onTagClick(tag)}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="hero-excerpt">
          {currentArticle.content.length > 220 
            ? `${currentArticle.content.substring(0, 220)}...` 
            : currentArticle.content}
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => onSelectArticle(currentArticle)}>
            ▶ Read Article
          </button>
        </div>
      </div>

      {featuredArticles.length > 1 && (
        <div className="hero-dots">
          {featuredArticles.map((_, idx) => (
            <span
              key={idx}
              className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', content: '', tags: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? 'No Date' : parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (Array.isArray(data)) setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleTagClick = (tagName) => {
    setSelectedArticle(null);
    setSearchTerm(tagName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedTags = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : ['General'];

      const payload = {
        title: formData.title,
        author: formData.author,
        content: formData.content,
        tags: parsedTags.length > 0 ? parsedTags : ['General']
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormData({ title: '', author: '', content: '', tags: '' });
        setShowModal(false);
        fetchArticles();
      }
    } catch (err) {
      console.error('Failed to save article', err);
    }
  };

  // Filter articles by search term or tag
  const filteredArticles = articles.filter((art) => {
    const query = searchTerm.toLowerCase();
    const articleTags = Array.isArray(art.tags) && art.tags.length > 0 ? art.tags : ['General'];
    const tagMatches = articleTags.some(t => String(t).toLowerCase().includes(query));

    return (
      (art.title && art.title.toLowerCase().includes(query)) ||
      (art.author && art.author.toLowerCase().includes(query)) ||
      (art.content && art.content.toLowerCase().includes(query)) ||
      tagMatches
    );
  });

  // Group filtered articles into distinct categories by tag
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const rawTags = Array.isArray(article.tags) && article.tags.length > 0 ? article.tags : ['General'];
    const uniqueTags = [...new Set(rawTags.map(t => String(t).trim()).filter(Boolean))];

    uniqueTags.forEach((tag) => {
      if (!acc[tag]) acc[tag] = [];
      if (!acc[tag].some(a => a._id === article._id)) {
        acc[tag].push(article);
      }
    });
    return acc;
  }, {});

  return (
    <div>
      <nav className="navbar">
        <div className="logo" onClick={() => { setSelectedArticle(null); setSearchTerm(''); }}>TECHFLIX</div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search titles, tags, content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Article</button>
      </nav>

      <div className="container">
        {selectedArticle ? (
          <div className="detail-view">
            <button className="back-btn" onClick={() => setSelectedArticle(null)}>← Back to Catalog</button>
            <h1 className="detail-title">{selectedArticle.title}</h1>
            <div className="detail-meta">
              By {selectedArticle.author} • {formatDate(selectedArticle.createdAt)}
            </div>

            {Array.isArray(selectedArticle.tags) && selectedArticle.tags.length > 0 && (
              <div className="tag-list">
                {selectedArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="tag-badge clickable"
                    onClick={() => handleTagClick(tag)}
                    title={`Filter articles by ${tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="detail-content">{selectedArticle.content}</p>
          </div>
        ) : (
          <>
            {/* Display Hero Carousel when not actively searching */}
            {!searchTerm && articles.length > 0 && (
              <HeroBanner
                articles={articles}
                onSelectArticle={setSelectedArticle}
                onTagClick={handleTagClick}
                formatDate={formatDate}
              />
            )}

            {searchTerm && (
              <div className="search-results-header">
                <h2>Showing results for: "{searchTerm}"</h2>
                <button className="back-btn" onClick={() => setSearchTerm('')}>Clear Filter</button>
              </div>
            )}

            {Object.keys(groupedArticles).length === 0 ? (
              <div className="no-results">
                <p>No articles found matching "{searchTerm}".</p>
                <button className="back-btn" onClick={() => setSearchTerm('')}>Clear Filter</button>
              </div>
            ) : (
              Object.entries(groupedArticles).map(([category, categoryArticles]) => (
                <CategoryRow
                  key={category}
                  category={category}
                  articles={categoryArticles}
                  onSelectArticle={setSelectedArticle}
                  onTagClick={handleTagClick}
                  formatDate={formatDate}
                />
              ))
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Article to TechFlix</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category Tags (comma-separated, e.g. React, Kubernetes)</label>
                <input type="text" placeholder="DevOps, React, Cloud" value={formData.tags || ''} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="add-btn">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
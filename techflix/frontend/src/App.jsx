import React, { useState, useEffect, useRef } from 'react';

// Reusable Netflix-style Category Row
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
        <h2 className="category-title" onClick={() => onTagClick(category)} style={{ cursor: 'pointer' }}>
          {category} <span className="category-arrow">›</span>
        </h2>
      </div>
      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => scroll('left')}>‹</button>
        <div className="slider-container" ref={rowRef}>
          {articles.map((art) => (
            <div key={art._id} className="card" onClick={() => onSelectArticle(art)}>
              <div className="card-title">{art.title}</div>
              <div className="card-author">By {art.author} {art.createdAt && `• ${formatDate(art.createdAt)}`}</div>
            </div>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll('right')}>›</button>
      </div>
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

  // Filter and reset back to main view when a tag is clicked
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
                    style={{ cursor: 'pointer' }}
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
            <div className="hero-banner">
              <h1>Tech Articles</h1>
              {searchTerm ? (
                <p>Showing articles tagged with: <strong>"{searchTerm}"</strong></p>
              ) : (
                <p>Get the tech info you need.</p>
              )}
            </div>

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
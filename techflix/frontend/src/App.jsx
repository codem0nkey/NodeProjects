import React, { useState, useEffect } from 'react';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', content: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', author: '', content: '' });
        setShowModal(false);
        fetchArticles();
      }
    } catch (err) {
      console.error('Failed to save article', err);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo" onClick={() => setSelectedArticle(null)}>TECHFLIX</div>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Article</button>
      </nav>

      <div className="container">
        {selectedArticle ? (
          <div className="detail-view">
            <button className="back-btn" onClick={() => setSelectedArticle(null)}>← Back to Catalog</button>
            <h1 className="detail-title">{selectedArticle.title}</h1>
            <div className="detail-meta">By {selectedArticle.author} • {formatDate(selectedArticle.createdAt)}</div>
            <p className="detail-content">{selectedArticle.content}</p>
          </div>
        ) : (
          <>
            <div className="hero-banner">
              <h1>Tech Articles</h1>
              <p>Get the tech info you need.</p>
            </div>
            <h2 className="section-title">Trending Articles</h2>
            <div className="grid">
              {articles.map((art) => (
                <div key={art._id} className="card" onClick={() => setSelectedArticle(art)}>
                  <div className="card-title">{art.title}</div>
                  <div className="card-author">By {art.author} {art.createdAt && `• ${formatDate(art.createdAt)}`}</div>
                </div>
              ))}
            </div>
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

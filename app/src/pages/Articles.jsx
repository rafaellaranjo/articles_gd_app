import React, { useEffect, useState } from 'react';
import { Container, Form, ButtonGroup, Button, Spinner, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import { ArticleService } from '../services/api';
import { Link } from 'react-router-dom';
import { PencilSquare } from 'react-bootstrap-icons';
import '../styles/colors.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await ArticleService.getAll();
        setArticles(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erro ao carregar artigos');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (!article) return false;
    
    const title = article.title || '';
    const description = article.description || '';
    const tags = article.tags || [];

    const matchesSearch = searchTerm === '' || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === '' || tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="articles-page">
      <Header />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Todos os artigos</h1>
          <Button 
            as={Link}
            to="/articles/new"
            variant="primary"
            className="ms-3 btn-new-article"
          >
            <span>+</span> Novo Artigo
          </Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <ButtonGroup className="flex-wrap">
            {['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'].map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'primary' : 'outline-secondary'}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className="me-2 mb-2"
              >
                {tag}
              </Button>
            ))}
          </ButtonGroup>
          <Form.Control 
            type="search" 
            placeholder="Pesquisar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        
        <hr className="my-4" />

        <div className="articles-list">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <article key={article.id || article._id} className="mb-4 pb-4 border-bottom position-relative">
                <Link
                  to={`/articles/edit/${article.id || article._id}`}
                  className="position-absolute top-0 end-0 text-secondary"
                  style={{ transform: 'translateY(-50%)' }}
                  aria-label="Editar artigo"
                >
                  <PencilSquare size={18} />
                </Link>
                <h3 className="mb-2 pe-4">
                  <Link 
                    to={`/articles/${article.id || article._id}`} 
                    className="text-decoration-none text-dark"
                  >
                    {article.title || 'Sem título'}
                  </Link>
                </h3>
                <p className="text-muted mb-2">{article.description || ''}</p>
                <span 
                  className="badge"
                  style={{
                    backgroundColor: 
                      article.tags?.[0] === 'Frontend' ? 'var(--tag-frontend)' :
                      article.tags?.[0] === 'Backend' ? 'var(--tag-backend)' :
                      article.tags?.[0] === 'Mobile' ? 'var(--tag-mobile)' :
                      article.tags?.[0] === 'DevOps' ? 'var(--tag-devops)' :
                      article.tags?.[0] === 'AI' ? 'var(--tag-ai)' : 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  {article.tags?.[0] || 'Geral'}
                </span>
              </article>
            ))
          ) : (
            <Alert variant="info" className="text-center">
              Nenhum artigo encontrado com os filtros atuais
            </Alert>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Articles;

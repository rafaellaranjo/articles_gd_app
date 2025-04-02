import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Container, Form, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { ArticleService } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [article, setArticle] = useState({
    author: user.username,
    title: '',
    content: '',
    tags: [],
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const data = await ArticleService.getById(id);
          setArticle({
            author: user.username,
            title: data.title,
            content: data.content,
            tags: data.tags,
            imageUrl: data.imageUrl || ''
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEdit) {
        await ArticleService.update(id, article);
      } else {
        await ArticleService.create(article);
      }
      setSuccess(true);
      setTimeout(() => navigate('/articles'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const allTags = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'];

  return (
    <div className="article-form-page">
      <Header />
      <Container className="py-4">
        <h1 className="mb-4">{isEdit ? 'Editar artigo' : 'Novo artigo'}</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">
          Artigo {isEdit ? 'atualizado' : 'criado'} com sucesso!
        </Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título do artigo *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={article.title}
              onChange={handleChange}
              placeholder="Título"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Imagem do artigo</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              value={article.imageUrl}
              onChange={handleChange}
              placeholder="URL da imagem"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Tags *</Form.Label>
            <div>
              <ButtonGroup className="mb-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={article.tags.includes(tag) ? 'primary' : 'outline-primary'}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Conteúdo *</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={15}
              value={article.content}
              onChange={handleChange}
              placeholder="Escreva aqui seu artigo..."
              required
            />
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : isEdit ? 'Atualizar Artigo' : 'Publicar Artigo'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ArticleForm;

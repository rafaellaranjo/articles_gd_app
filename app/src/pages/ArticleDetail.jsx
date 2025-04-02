import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Badge, Form, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import Header from '../components/Header';
import { ArticleService, CommentService } from '../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleData, commentsData] = await Promise.all([
          ArticleService.getById(id),
          CommentService.getByArticleId(id)
        ]);
        setArticle(articleData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || 'Erro ao carregar artigo');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await CommentService.create({
        author: user.username,
        articleId: id,
        content: newComment
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Erro ao enviar comentário');
    }
  };

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
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Artigo não encontrado</Alert>
        <Button variant="secondary" onClick={() => navigate('/articles')}>
          Voltar para artigos
        </Button>
      </Container>
    );
  }

  return (
    <div className="article-detail-page">
      <Header />
      <Container className="py-4">
        <Badge bg="primary" className="mb-2">{article.tags?.[0] || 'Sem tag'}</Badge>
        <h1 className="mb-3">{article.title}</h1>
        <p className="text-muted mb-4">
          Publicado por {article.author?.name || 'Autor desconhecido'} • {new Date(article.createdAt).toLocaleDateString()}
        </p>
        
        <article className="mb-5">
          <p className="lead">{article.content}</p>
        </article>
        
        <section className="comments-section">
          <h2 className="mb-4">Comentários</h2>
          
          <Form onSubmit={handleSubmitComment} className="mb-4">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Publicar
            </Button>
          </Form>
          
          <ListGroup>
            {comments.length > 0 ? (
              comments.map(comment => (
                <ListGroup.Item key={comment._id} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{comment.author?.name || 'Anônimo'}</strong>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0 mt-2">{comment.content}</p>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>
                <p className="text-muted mb-0">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </ListGroup.Item>
            )}
          </ListGroup>
        </section>
      </Container>
    </div>
  );
};

export default ArticleDetail;

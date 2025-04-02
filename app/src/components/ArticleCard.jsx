import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

const ArticleCard = ({ id, title, description, tag }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Badge bg="primary" className="mb-2">{tag}</Badge>
        <Card.Title>
          <Link to={`/articles/${id}`} className="text-decoration-none stretched-link">
            {title}
          </Link>
        </Card.Title>
        <Card.Text className="text-muted">{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;

import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main className="py-5 bg-light">
        <Container className="text-center py-5">
          <h2 className="display-4 mb-3">Insights & Learning</h2>
          <p className="lead text-muted mb-4">Explorando tendências Tech, um post por vez</p>
          <Button as={Link} to="/articles" variant="primary" size="lg">Começar a ler</Button>
        </Container>
      </main>
    </div>
  );
};

export default Home;

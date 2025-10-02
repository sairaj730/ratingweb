
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>Welcome to RatingWeb</h1>
        <p>The ultimate platform for rating and reviewing stores. Your opinion matters.</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

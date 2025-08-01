import React from 'react';
import './App.css';

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        Founder's <span className="highlight">Kit</span>
      </h1>
      <p className="hero-subtitle">
        Generate stunning websites, craft perfect marketing emails, create product images, and understand your customers—all powered by cutting-edge AI technology.
      </p>
      <button className="btn btn-primary btn-large">Start Building</button>
    </section>
  );
}
export default Hero;
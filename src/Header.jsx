import React from 'react';
import './App.css';


// --- Components ---

function Header() {
  return (
    <header className="header">
      <div className="logo">F<span className="highlight">K</span></div>
      <nav className="nav">
        <a href="#features" className="nav-link">Features</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#signin" className="nav-link">Sign In</a>
        <button className="btn btn-primary">Get Started</button>
      </nav>
    </header>
  );
}

export default Header;
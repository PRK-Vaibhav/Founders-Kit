import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';


// --- Components ---

function Header() {
    const navigate = useNavigate();
  return (
    <header className="header">
      <a className="logo" style = {{textDecoration:'none', cursor: 'pointer'}} onClick={() => navigate('/')}>F<span className="highlight">K</span></a>
      <nav className="nav">
        <a href="#features" className="nav-link">Features</a>
        <a style = {{cursor: 'pointer'}} onClick={() => navigate('/About')} className="nav-link">About</a>
        <a href="#signin" className="nav-link">Sign In</a>
        <a href="#signin" className="nav-link">Register</a>
      </nav>
    </header>
  );
}

export default Header;
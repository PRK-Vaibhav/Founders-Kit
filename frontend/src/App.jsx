import React from 'react';
import './App.css'; // Assuming you have a CSS file for styles
import Web from './components/BuildWed.jsx';
import Features from './components/Features.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Title.jsx';
import BusinessGrowthSection from './components/BussinessGrowth.jsx';
import Footer from './components/Footer.jsx';
import Image from './components/Image.jsx';
import Email from './components/Email.jsx';
import About from './components/About.jsx';
import ChatAi from './components/ChatAi.jsx'; 
import Login from './components/Login.jsx';
import Register from './components/register.jsx';
import Logo from './components/Logo.jsx';
import Blog from './components/Blog.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      {/* The <main> content is now handled entirely by the router */}
      <main>
        <Routes>
          {/* Route for the homepage */}
          <Route 
            path="/" 
            element={
              <>
                <Hero />
                <Features />
                <BusinessGrowthSection />
              </>
            } 
          />
          <Route path="/BuildWed" element={<Web />} />
          <Route path="/Login" element={<Login />} />
          <Route path = "/Blog" element={<Blog />} />
          <Route path="/Logo" element={<Logo />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/About" element={<About />} />
          <Route path="/ChatAi" element={<ChatAi />} />     
          <Route path="/Image" element={<Image />} />
          <Route path="/Email" element={<Email />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
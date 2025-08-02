import React from 'react';
import './App.css'; // Assuming you have a CSS file for styles
import Web from './BuildWed.jsx';
import Features from './Features.jsx';
import Header from './Header.jsx';
import Hero from './Title.jsx';
import BusinessGrowthSection from './BussinessGrowth.jsx';
import Footer from './Footer.jsx';
import Image from './Image.jsx';
import Email from './Email.jsx';
import About from './About.jsx';
import ChatAi from './ChatAi.jsx'; 
import Login from './Login.jsx';
import Register from './register.jsx';
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
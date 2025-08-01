import React from 'react';
import './App.css';
import Web from './BuildWed.jsx';
import Features from './Features.jsx';
import Header from './Header.jsx';
import Hero from './Title.jsx';
import BusinessGrowthSection from './BussinessGrowth.jsx';
import Footer from './Footer.jsx';
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
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
import React from 'react';

function About() {
  return (
    <section className="hero" style={{ textAlign: 'left', alignItems: 'flex-start', padding: '4rem 5%' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="hero-title">
          About Founder's <span className="highlight">Kit</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '2rem' }}>
          Our mission is to empower entrepreneurs and small businesses by providing cutting-edge AI tools that make building and growing an online presence simple, fast, and effective.
        </p>

        <div className="feature-card" style={{ marginBottom: '2rem' }}>
            <h3 className="feature-card-title">What We Do</h3>
            <p className="feature-card-description">
                Founder's Kit is an all-in-one platform designed to automate the most challenging aspects of launching a business. From generating a professional website in seconds to crafting compelling marketing content, our AI-powered tools handle the heavy lifting, so you can focus on what you do best: running your business.
            </p>
        </div>

        <div className="feature-card">
            <h3 className="feature-card-title">Our Technology</h3>
            <p className="feature-card-description">
                We leverage state-of-the-art generative AI models, including Google's Gemini for text and content generation and Imagen for high-quality visual creation. By fine-tuning these powerful technologies for business applications, we provide a seamless and intelligent experience that delivers real results.
            </p>
        </div>
      </div>
    </section>
  );
}

export default About;

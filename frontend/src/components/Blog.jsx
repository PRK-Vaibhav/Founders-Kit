import { useState } from 'react';

// API model to be used for text generation
const API_MODEL = 'gemini-2.5-flash-preview-05-20'; // Using the latest powerful model

// A reusable utility for making API calls with exponential backoff
const callApiWithBackoff = async (apiCall, retries = 3, delay = 1000) => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0) {
      console.warn(`API call failed. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
      return callApiWithBackoff(apiCall, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Prompt template to guide the AI for generating blog posts
const blogPromptTemplate = (businessName, topic, audience) => `
Create a short, sweet, and to-the-point blog post in Markdown format. The post should be easy to understand and visually structured. Use a friendly tone and avoid jargon.

- Title: A concise and attention-grabbing title.
- Content: 2-3 brief paragraphs that explain the topic clearly. Use a few bullet points if helpful.
- Call to Action: A single, clear call to action.

Business Name: ${businessName || 'A business'}
Blog Post Topic: ${topic}
Target Audience: ${audience || 'General public'}

Please format the response in Markdown and do not include any extra commentary.
`;

// Helper function to render simple Markdown to JSX using Bootstrap classes
const renderMarkdown = (markdownText) => {
  if (!markdownText) return null;
  const lines = markdownText.split('\n');
  return lines.map((line, index) => {
    // Render headings
    if (line.startsWith('# ')) {
      return <h2 key={index} className="h3 fw-bold mt-4 mb-2">{line.substring(2)}</h2>;
    }
    // Render bullet points
    if (line.startsWith('- ')) {
      return <li key={index} className="mb-1">{line.substring(2)}</li>;
    }
    // Render bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = line.split(boldRegex);
    const renderedParts = parts.map((part, pIndex) => {
      if (pIndex % 2 === 1) {
        return <strong key={pIndex}>{part}</strong>;
      }
      return part;
    });

    // Render paragraphs
    if (line.trim() !== '') {
      return <p key={index} className="mb-3">{renderedParts}</p>;
    }
    return <br key={index} />; // Keep line breaks for spacing
  });
};

// Main App component
export default function BlogWriter() {
  const [businessName, setBusinessName] = useState('');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Function to handle the blog post generation
  const handleGenerate = async () => {
    setPostContent('');
    setError(null);
    setIsLoading(true);
    setCopied(false);

    if (!topic) {
      setError('Please provide a topic for the blog post.');
      setIsLoading(false);
      return;
    }

    const fullPrompt = blogPromptTemplate(businessName, topic, audience);
    // Best practice: Use environment variables for API keys
    const apiKey = 'AIzaSyC1fJX3VJlyF5galObc0vYmFbbtW3rCkTs'; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${apiKey}`;

    const apiCall = async () => {
      const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }],
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    };

    try {
      const result = await callApiWithBackoff(apiCall);
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setPostContent(text);
      } else {
        setError('Failed to generate content. The response was empty or blocked.');
      }
    } catch (err) {
      console.error("Failed to generate content:", err);
      setError(`Failed to generate blog post: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle copying the content to the clipboard
  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = postContent;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-dark text-white">
      <div className="w-100 bg-secondary p-5 rounded-4 shadow-lg border border-dark" style={{ maxWidth: '768px' }}>
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bolder mb-2 text-primary">
            AI Blog Post Writer
          </h1>
          <p className="fs-5 text-white-50">
            Create a professional blog post in seconds.
          </p>
        </header>

        <main>
          <div className="d-grid gap-4 mb-4">
            <div>
              <label htmlFor="topic" className="form-label fw-semibold mb-2">
                Blog Post Topic <span className="text-danger">*</span>
              </label>
              <input
                id="topic"
                type="text"
                className="form-control form-control-lg bg-dark text-white border-secondary"
                placeholder="e.g., How to improve customer service"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <div className="row g-4">
              <div className="col-md">
                <label htmlFor="business-name" className="form-label fw-semibold mb-2">
                  Business Name
                </label>
                <input
                  id="business-name"
                  type="text"
                  className="form-control form-control-lg bg-dark text-white border-secondary"
                  placeholder="e.g., Nexus Innovations"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="col-md">
                <label htmlFor="audience" className="form-label fw-semibold mb-2">
                  Target Audience
                </label>
                <input
                  id="audience"
                  type="text"
                  className="form-control form-control-lg bg-dark text-white border-secondary"
                  placeholder="e.g., Small business owners"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 d-inline-flex align-items-center gap-2"
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.5 15.8L22 2.3l-8.5 9.5-2-4-3.5 14.2 1.5-6.5z"></path>
                </svg>
              )}
              <span>{isLoading ? 'Generating...' : 'Generate Post'}</span>
            </button>
          </div>
        </main>
        
        <section>
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-3" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <div>{error}</div>
            </div>
          )}

          {postContent && (
            <div className="position-relative bg-dark rounded border border-secondary p-4 mt-4">
              <h2 className="h4 fw-bold mb-4 text-primary d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                Generated Blog Post
              </h2>
              <div className="text-light">
                {renderMarkdown(postContent)}
              </div>
              <div className="position-absolute top-0 end-0 p-3">
                <button
                  onClick={handleCopy}
                  className="btn btn-dark"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-success">Copied!</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

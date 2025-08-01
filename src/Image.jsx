import React, { useState, useCallback } from 'react';
import { Sparkles, ImageDown, XCircle, RefreshCcw } from 'lucide-react';

export default function Image() {
  const [businessName, setBusinessName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

// In Image.jsx
const handleGenerate = useCallback(async () => {
  setImageUrl('');
  setError(null);
  setIsLoading(true);

  let fullPrompt = prompt.trim();
  if (businessName.trim()) {
    fullPrompt = `A high-quality, high-definition image for a business named "${businessName.trim()}". The image should be ${prompt.trim()}.`;
  } else {
    fullPrompt = `A high-quality, high-definition image of ${prompt.trim()}.`;
  }

  if (!prompt.trim()) {
    setError('Please enter an image description.');
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/generateImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt }),
    });

    // If the response is not OK, handle the error without crashing
    if (!response.ok) {
      let errorText = `The backend returned a ${response.status} error.`;
      // Try to get a more specific error message from the response body
      try {
        const errorData = await response.json();
        errorText = errorData.error || errorText;
      } catch (e) {
        // The error response was not JSON, use the status text instead
        errorText = response.statusText;
      }
      throw new Error(errorText);
    }

    // If the response is OK, parse the successful JSON result
    const result = await response.json();

    if (result.imageBase64) {
      const url = `data:image/png;base64,${result.imageBase64}`;
      setImageUrl(url);
    } else {
      throw new Error('Failed to retrieve image data from the API response.');
    }
  } catch (err) {
    console.error("Failed to generate image:", err);
    setError(`Failed to generate image: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
}, [businessName, prompt]);

  return (
    <div className="min-vh-100 bg-dark text-white d-flex align-items-center justify-content-center p-4">
      <div className="bg-secondary p-5 rounded-4 shadow-lg w-100 d-flex flex-column align-items-center" style={{ maxWidth: '768px' }}>
        {/* Application title and description */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-gradient mb-2">
            AI Image Generator
          </h1>
          <p className="text-white-50">
            Describe the image you want to create and click "Generate".
          </p>
        </div>

        {/* Input fields and generate button */}
        <div className="w-100 d-grid gap-4">
          <div className="d-flex flex-column">
            <label htmlFor="business-name" className="form-label text-light fw-semibold">Business Name (Optional)</label>
            <input
              id="business-name"
              type="text"
              className="form-control form-control-lg bg-dark text-white border-secondary"
              placeholder="e.g., Acme Corporation"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="description-prompt" className="form-label text-light fw-semibold">Image Description</label>
            <div className="input-group">
              <input
                id="description-prompt"
                type="text"
                className="form-control form-control-lg bg-dark text-white border-secondary"
                placeholder="e.g., a futuristic cityscape at sunset"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="btn btn-gradient-primary btn-lg d-flex align-items-center gap-2"
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Display area for results or messages */}
        <div className="w-100 bg-dark rounded p-4 position-relative d-flex align-items-center justify-content-center mt-5" style={{ minHeight: '300px' }}>
          {error && (
            <div className="d-flex flex-column align-items-center text-danger">
              <XCircle size={48} className="mb-2" />
              <p className="text-center">{error}</p>
            </div>
          )}
          {isLoading && (
            <div className="d-flex flex-column align-items-center text-white-50">
              <Sparkles className="animate-pulse mb-2" size={48} />
              <p>Generating your masterpiece...</p>
            </div>
          )}
          {imageUrl && (
            <div className="d-flex flex-column align-items-center gap-4 w-100">
              <img
                src={imageUrl}
                alt="Generated by AI"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px' }}
              />
              <div className="d-flex gap-4">
                  <button
                    onClick={handleGenerate}
                    className="btn btn-gradient-primary btn-lg d-flex align-items-center gap-2"
                  >
                      <RefreshCcw size={20} />
                      <span>Regenerate</span>
                  </button>
                  <a
                    href={imageUrl}
                    download="ai_generated_image.png"
                    className="btn btn-gradient-secondary btn-lg d-flex align-items-center gap-2"
                    title="Download Image"
                  >
                      <ImageDown size={20} />
                      <span>Download</span>
                  </a>
              </div>
            </div>
          )}
          {!isLoading && !error && !imageUrl && (
            <p className="text-white-50">Your image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
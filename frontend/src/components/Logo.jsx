import React, { useState, useCallback } from 'react';
import { Sparkles, ImageDown, XCircle, RefreshCcw } from 'lucide-react';

export default function Poster() {
  const [businessName, setBusinessName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = useCallback(async () => {
    setImageUrl('');
    setError(null);
    setIsLoading(true);

    let fullPrompt = prompt.trim();
    if (!prompt) {
      setError('Please enter an image description.');
      setIsLoading(false);
      return;
    }

    // ...existing code...
fullPrompt = businessName.trim()
  ? `Design a high-quality, modern, and visually appealing logo for a business named "${businessName.trim()}". The logo should represent: ${prompt.trim()}. Use clean lines, simple shapes, and a professional color palette suitable for branding.`
  : `Design a high-quality, modern, and visually appealing logo that represents: ${prompt.trim()}. Use clean lines, simple shapes, and a professional color palette suitable for branding.`;
    try {
      const payload = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        },
      };

      const apiKey = "AIzaSyC1fJX3VJlyF5galObc0vYmFbbtW3rCkTs";
      const apiUrl =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText || 'Unknown error';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error.message || errorMessage;
        } catch (_) {}
        throw new Error(`API error: ${response.status} - ${errorMessage}`);
      }

      const result = JSON.parse(responseText);
      const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (base64Data) {
        const url =` data:image/png;base64,${base64Data}`;
        setImageUrl(url);
      } else {
        const fallbackText = result?.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
        throw new Error(fallbackText || 'Failed to retrieve image data.');
      }
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError(`Failed to generate image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [businessName, prompt]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black text-white p-4">
      <div className="bg-dark p-5 rounded-4 shadow-lg w-100" style={{ maxWidth: '768px' }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white mb-2">
            AI Logo Generator
          </h1>
          <p className="text-white-50">Describe your business Logo and click "Generate".</p>
        </div>

        <div className="mb-4">
          <label htmlFor="business-name" className="form-label text-light fw-semibold">Business Name</label>
          <input
            id="business-name"
            type="text"
            className="form-control form-control-lg bg-black text-white border-secondary"
            placeholder="e.g., Acme Corporation"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description-prompt" className="form-label text-light fw-semibold">Ad Description</label>
          <div className="input-group">
            <input
              id="description-prompt"
              type="text"
              className="form-control form-control-lg bg-black text-white border-secondary"
              placeholder="e.g., summer sale, new product launch"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn btn-lg btn-primary d-flex align-items-center gap-2"
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm text-light" role="status" />
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-black border border-secondary rounded p-4 position-relative d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
          {error && (
            <div className="text-danger text-center">
              <XCircle size={48} className="mb-2" />
              <p>{error}</p>
            </div>
          )}
          {isLoading && (
            <div className="text-white-50 text-center">
              <Sparkles className="mb-2" size={48} />
              <p>Generating your masterpiece...</p>
            </div>
          )}
          {imageUrl && (
            <div className="d-flex flex-column align-items-center w-100 gap-3">
              <img
                src={imageUrl}
                alt="Generated Poster"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px' }}
              />
              <div className="d-flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="btn btn-lg btn-outline-primary d-flex align-items-center gap-2"
                >
                  <RefreshCcw size={20} />
                  <span>Regenerate</span>
                </button>
                <a
                  href={imageUrl}
                  download="business_poster.png"
                  className="btn btn-lg btn-outline-success d-flex align-items-center gap-2"
                >
                  <ImageDown size={20} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}
          {!isLoading && !error && !imageUrl && (
            <p className="text-white-50">Your generated poster will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}

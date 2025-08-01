import React, { useState, useEffect } from 'react';
// The react-icons library is no longer needed for the spinner
// import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// const API_KEY = 'AIzaSyA4RTNfhLTLBKYeeUckd6hsJxKFzYAnBsQ'; // This is correct for Create React App
const API_KEY = 'AIzaSyAnQS1euM8Nr1XTomlm0w0-zof3wBz-9eE'; // This is correct for Create React App

const fetchWithExponentialBackoff = async (url, options, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      console.warn(`API call throttled. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    } else {
      return response;
    }
  }
  throw new Error("Too many requests. Try again later.");
};

// showMessage function updated with Bootstrap alert classes
const showMessage = (message, type = 'info') => {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.textContent = message;

    // Base classes
    messageBox.className = 'alert shadow-lg position-fixed bottom-0 start-50 translate-middle-x mb-3';

    if (type === 'error') {
        messageBox.classList.add('alert-danger');
    } else if (type === 'success') {
        messageBox.classList.add('alert-success');
    } else {
        messageBox.classList.add('alert-info');
    }

    messageBox.classList.remove('d-none');
    setTimeout(() => {
        messageBox.classList.add('d-none');
    }, 5000);
};

const EditableSection = ({ title, content, type, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleSave = () => {
        onSave(editedContent);
        setIsEditing(false);
    };

    return (
        <div className="p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 fw-bold">{title}</h2>
                <button
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className="btn btn-secondary btn-sm rounded-pill px-3"
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            {isEditing ? (
                <textarea
                    className="form-control bg-dark text-white border-secondary"
                    rows="5"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
            ) : (
                <div>
                    {type === 'list' ? (
                        <ul className="text-light-emphasis">
                            {editedContent.split('\n').map((item, index) => (
                                <li key={index}>{item.replace(/^- /, '• ')}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-light-emphasis lh-base">{editedContent}</p>
                    )}
                </div>
            )}
        </div>
    );
};

const MarketingTools = ({ businessName }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [isEmailGenerating, setIsEmailGenerating] = useState(false);
    const [isSocialGenerating, setIsSocialGenerating] = useState(false);
    const [currentEmailContent, setCurrentEmailContent] = useState(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);

    // All generation logic (generateMarketingEmail, etc.) remains the same
    const generateMarketingEmail = async (e) => {
    e.preventDefault();
    if (isEmailGenerating) return;
    setIsEmailGenerating(true);

    const emailPrompt = `Draft a professional marketing email for a product named "${productName}" from the business "${businessName}". The product is described as: "${productDescription}". Provide a catchy subject line and a friendly, engaging email body. The email should be returned as a JSON object with keys "subject" and "body". The body should be multi-paragraph.`;

    const emailPayload = {
      contents: [{ parts: [{ text: emailPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING' },
            body: { type: 'STRING' },
          },
        },
      },
    };

    const emailApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    try {
      const emailResponse = await fetchWithExponentialBackoff(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });
      const emailResult = await emailResponse.json();
      const generatedContent = JSON.parse(emailResult.candidates[0].content.parts[0].text);
      setCurrentEmailContent(generatedContent);
      setShowEmailModal(true);
    } catch (error) {
      console.error('Email generation failed:', error);
      showMessage('Failed to generate marketing email. Please try again.', 'error');
    } finally {
      setIsEmailGenerating(false);
    }
  };

    const generateSocialMediaPost = async () => {
    if (isSocialGenerating || !currentEmailContent) return;
    setIsSocialGenerating(true);

    const socialPrompt = `Draft a concise and engaging social media post to promote an email with the subject "${currentEmailContent.subject}" and body "${currentEmailContent.body}". Use emojis and relevant hashtags. The post should be a single paragraph.`;

    const socialPayload = {
      contents: [{ parts: [{ text: socialPrompt }] }],
    };

    const socialApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    try {
      const socialResponse = await fetchWithExponentialBackoff(socialApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialPayload),
      });
      const socialResult = await socialResponse.json();
      const socialContent = socialResult.candidates[0].content.parts[0].text;
      setShowSocialModal(socialContent);
    } catch (error) {
      console.error('Social media post generation failed:', error);
      showMessage('Failed to generate social media post. Please try again.', 'error');
    } finally {
      setIsSocialGenerating(false);
    }
  };

    return (
        <>
            <div className="bg-light text-dark p-5">
                <h2 className="h3 fw-bold mb-2">Generate a Marketing Email ✨</h2>
                <p className="fs-5 text-secondary mb-4">Create a compelling email draft for your latest product or service.</p>
                <form onSubmit={generateMarketingEmail} className="d-grid gap-3">
                    <div>
                        <label htmlFor="product-name" className="form-label">Product Name</label>
                        <input type="text" id="product-name" required className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="form-label">Product Description</label>
                        <textarea id="product-description" rows="3" required className="form-control" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                    </div>
                    <div className="text-center d-grid d-sm-block gap-2">
                        <button type="submit" className="btn btn-primary rounded-pill px-4 py-2" disabled={isEmailGenerating}>
                            {isEmailGenerating ? 'Generating...' : 'Generate Email Draft ✨'}
                        </button>
                        <button type="button" className="btn btn-info rounded-pill px-4 py-2 ms-sm-2" onClick={generateSocialMediaPost} disabled={isSocialGenerating || !currentEmailContent}>
                            {isSocialGenerating ? 'Generating...' : 'Generate Social Post 🚀'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Email Modal */}
            {showEmailModal && currentEmailContent && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title h4">Generated Email Draft ✨</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEmailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="fw-bold fs-5">Subject: {currentEmailContent.subject}</p>
                                <hr />
                                {currentEmailContent.body.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Modal */}
            {showSocialModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title h4">Generated Social Post 🚀</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSocialModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{showSocialModal}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


const WebsiteGenerator = () => {
    const [view, setView] = useState('welcome');
    const [businessInfo, setBusinessInfo] = useState({ businessName: '', businessType: '', businessDescription: '' });
    const [websiteContent, setWebsiteContent] = useState(null);
    const [heroImage, setHeroImage] = useState('');
    const [isImageGenerating, setIsImageGenerating] = useState(false);


    const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

   // In BuildWed.jsx

const generateImage = async (prompt) => {
  const payload = {
    contents: [{ parts: [{ text: `Generate a realistic photo for: ${prompt}` }] }],
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const base64 = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!base64?.startsWith('data:image')) {
    throw new Error("Image generation failed or returned non-image content.");
  }

  return base64;
};



function extractFirstJsonObject(text) {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("No valid JSON object found.");
  }
  const jsonString = text.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
}


    const generateWebsite = async (e) => {
  e.preventDefault();
  setView('loading');

  try {
    const textPrompt = `Generate a valid JSON object for a one-page website.
      The business name is "${businessInfo.businessName}", the type is "${businessInfo.businessType}", and the description is: "${businessInfo.businessDescription}".
      The JSON object must include:
      {
        "business_name": "",
        "tagline": "",
        "about_us_title": "",
        "about_us_content": "",
        "services_title": "",
        "services_content": "",
        "cta_text": ""
      }
      DO NOT add anything outside the JSON. DO NOT wrap in markdown like \`\`\`json. No SEO hashtags, no explanation. Just pure JSON.`;

    const textPayload = {
      contents: [{ parts: [{ text: textPrompt }] }],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetchWithExponentialBackoff(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(textPayload),
    });

    const result = await response.json();
    let rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Empty response from AI.");

    console.log("Attempting to parse JSON:", rawText);

    let content;
    try {
      content = extractFirstJsonObject(rawText);
    } catch (err) {
      console.warn("Failed to parse directly, retrying fix...");

      const fixPrompt = `Fix this broken JSON and return only clean JSON object:\n${rawText}`;
      const fixPayload = { contents: [{ parts: [{ text: fixPrompt }] }] };

      const fixResponse = await fetchWithExponentialBackoff(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fixPayload),
      });

      const fixedResult = await fixResponse.json();
      let fixedText = fixedResult?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      content = extractFirstJsonObject(fixedText);
    }

    setWebsiteContent(content);

    const imagePrompt = `A professional, aesthetic photo representing a "${businessInfo.businessType}" business named "${businessInfo.businessName}".`;
    const imageUrl = await generateImage(imagePrompt);
    setHeroImage(imageUrl);
    setView('website');
  } catch (error) {
    console.error('Website generation failed:', error);
    showMessage('Website generation failed. Please try again.', 'error');
    setView('questionnaire');
  }
};



    const generateNewImage = async () => {
    if (isImageGenerating) return;
    setIsImageGenerating(true);

    const imagePrompt = `A professional, high-quality photograph of a storefront or product related to a "${businessInfo.businessType}" business. The image should be warm, inviting, and professional, and should feature the name "${businessInfo.businessName}" prominently on the facade or within the scene. Use a modern, appealing aesthetic. The name should be easily readable.`;

    try {
      const newImageUrl = await generateImage(imagePrompt);
      setHeroImage(newImageUrl);
    } catch (error) {
      console.error('Image regeneration failed:', error);
      showMessage('Failed to generate a new image. Please try again.', 'error');
    } finally {
      setIsImageGenerating(false);
    }
  };

    const handleEditSave = (sectionName, newContent) => {
    setWebsiteContent(prev => ({
      ...prev,
      [sectionName]: newContent
    }));
  };


    const renderView = () => {
        switch (view) {
            case 'welcome':
                return (
                    <div className="text-center p-5">
                        <h1 className="display-4 fw-bold text-dark mb-3">Launch Your Business Online</h1>
                        <p className="fs-5 text-secondary mb-4">Tell our AI a little about your business, and we'll instantly generate a professional one-page website for you.</p>
                        <button className="btn btn-primary btn-lg rounded-pill px-5 py-3" onClick={() => setView('questionnaire')}>
                            Get Started
                        </button>
                    </div>
                );
            case 'questionnaire':
                return (
                    <div className="p-md-5">
                        <h2 className="h3 fw-bold text-dark mb-4 text-center">Tell Us About Your Business</h2>
                        <form onSubmit={generateWebsite} className="d-grid gap-4">
                            <div>
                                <label htmlFor="business-name" className="form-label">Business Name</label>
                                <input type="text" id="business-name" name="businessName" required className="form-control form-control-lg" value={businessInfo.businessName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="business-type" className="form-label">Type of Business (e.g., "bakery," "plumbing service")</label>
                                <input type="text" id="business-type" name="businessType" required className="form-control form-control-lg" value={businessInfo.businessType} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="business-description" className="form-label">Brief Description of your business</label>
                                <textarea id="business-description" name="businessDescription" rows="3" required className="form-control form-control-lg" value={businessInfo.businessDescription} onChange={handleChange} />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-success btn-lg rounded-pill px-5 py-3">
                                    Generate Website
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'loading':
                return (
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary mx-auto" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="fs-5 text-secondary mt-3">Our AI is building your website... this may take a moment.</p>
                    </div>
                );
            case 'website':
                return (
                    <div className="p-0 p-md-4">
                        <div className="rounded-4 overflow-hidden shadow-lg">
                            <div className="position-relative bg-dark text-white">
                                <div className="position-relative" style={{ height: '24rem' }}>
                                    <img src={heroImage} alt={`AI-generated hero for ${websiteContent.business_name}`} className={`w-100 h-100 object-fit-cover ${isImageGenerating ? 'opacity-25' : 'opacity-50'}`} />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 text-center bg-dark bg-opacity-50">
                                        <div>
                                            <h1 className="display-3 fw-bold mb-2">{websiteContent.business_name}</h1>
                                            <p className="fs-4 fw-light fst-italic">{websiteContent.tagline}</p>
                                            <button className="mt-4 btn btn-light rounded-pill" onClick={generateNewImage} disabled={isImageGenerating}>
                                                {isImageGenerating ? 'Generating...' : 'Generate Another Image'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <EditableSection title={websiteContent.about_us_title} content={websiteContent.about_us_content} type="text" onSave={(newContent) => handleEditSave('about_us_content', newContent)} />

                                <div className="bg-black bg-opacity-25">
                                    <EditableSection title={websiteContent.services_title} content={websiteContent.services_content} type="list" onSave={(newContent) => handleEditSave('services_content', newContent)} />
                                </div>

                                <div className="p-5 text-center bg-primary text-white">
                                    <p className="display-6 fw-bold mb-4">{websiteContent.cta_text}</p>
                                    <button className="btn btn-light btn-lg text-primary fw-bold rounded-pill px-5 py-3">Contact Us</button>
                                </div>

                                <MarketingTools businessName={websiteContent.business_name} />
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button className="btn btn-danger btn-lg rounded-pill px-5 py-3" onClick={() => setView('welcome')}>
                                Start Over
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-light d-flex align-items-center justify-content-center min-vh-100 p-3">
            <div className="container bg-white rounded-4 shadow-lg p-3 p-md-5 my-4">
                {renderView()}
            </div>
            <div id="message-box" className="d-none" role="alert">
                <p id="message-text"></p>
            </div>
        </div>
    );
};

export default WebsiteGenerator;
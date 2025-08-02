import React, { useState } from 'react';
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Main App component
export default function Email() {
  const [businessName, setBusinessName] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [emailTopic, setEmailTopic] = useState('');

  const [emailType, setEmailType] = useState('Marketing Emails');
  
  const [invitationDate, setInvitationDate] = useState('');
  const [invitationTime, setInvitationTime] = useState('');
  const [invitationVenue, setInvitationVenue] = useState('');
  const [invitationEvents, setInvitationEvents] = useState('');

  const [offerRecipient, setOfferRecipient] = useState('');
  const [offerRole, setOfferRole] = useState('');
  const [offerSalary, setOfferSalary] = useState('');
  
  const [feedbackProduct, setFeedbackProduct] = useState('');
  const [feedbackLink, setFeedbackLink] = useState('');

  const [generatedEmail, setGeneratedEmail] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  const emailTypes = [
    "Transactional Emails",
    "Marketing Emails",
    "Informational Emails",
    "Follow-up Emails",
    "Customer Support Emails",
    "Internal Communication Emails",
    "Cold Emails / Outreach Emails",
    "Invitation Emails",
    "Reminder Emails",
    "Thank You Emails",
    "Apology Emails",
    "Feedback Request Emails",
    "Newsletter Emails",
    "Welcome Emails",
    "Resignation or Exit Emails",
    "Reference or Recommendation Emails",
    "Performance Review Emails",
    "Job Application Emails",
    "Offer or Appointment Letters",
    "Legal or Policy Notification Emails"
  ];

  const clearStatus = () => {
    setError(null);
    setStatusMessage('');
  };

  const handleGenerateEmail = async () => {
    setLoadingEmail(true);
    clearStatus();
    setStatusMessage('Drafting your creative business email...');
    setGeneratedEmail('');

    let prompt = `
      Draft a professional ${emailType} for a small business based on this topic.
      The email must be in plain text format. Use a few tasteful and relevant emojis, bolding (with **), and clear line breaks to make it visually appealing and easy to read.
      
      Business Name: ${businessName || 'Your Business'}
      Website/Social Media Link: ${websiteLink || 'Not specified'}
      Contact Information: ${contactInfo || 'Not specified'}
      Topic: ${emailTopic}
    `;

    if (emailType === 'Invitation Emails') {
      prompt += `
      Invitation Details:
      - Date: ${invitationDate}
      - Time: ${invitationTime}
      - Venue: ${invitationVenue}
      - Events: ${invitationEvents || 'Not specified'}
      `;
    } else if (emailType === 'Offer or Appointment Letters') {
      prompt += `
      Offer Details:
      - Recipient Name: ${offerRecipient}
      - Position/Role: ${offerRole}
      - Salary/Terms: ${offerSalary}
      `;
    } else if (emailType === 'Feedback Request Emails') {
      prompt += `
      Feedback Details:
      - Product/Service: ${feedbackProduct}
      - Feedback Link: ${feedbackLink}
      `;
    }

    prompt += `
      Include a clear subject line, a friendly greeting, a body explaining the topic, and a prominent call-to-action.
    `;

    try {
      const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = 'AIzaSyC1fJX3VJlyF5galObc0vYmFbbtW3rCkTs'; // <<-- REMEMBER TO REPLACE THIS
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }); 

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
      }
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('Invalid response structure from the API.');
      setGeneratedEmail(text);
      setStatusMessage('Creative email drafted successfully!');
    } catch (e) {
      console.error(e);
      setError('Failed to generate the email. Please check your inputs and try again.');
      setStatusMessage('');
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center p-4">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5" style={{ maxWidth: '900px', width: '100%' }}>
        <h1 className="h2 fw-bold text-dark text-center mb-1">
          AI-Powered Business Toolkit
        </h1>
        <p className="text-center text-muted mb-5">
          Use the AI to draft a creative and professional business email.
        </p>
        
        {/* Status/Error Message Display */}
        {statusMessage && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                <CheckCircle size={20} />
                <div>{statusMessage}</div>
            </div>
        )}
        {error && (
            <div className="alert alert-danger mb-4">
                {error}
            </div>
        )}

        {/* Business Email Generator */}
        <h2 className="h4 fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Mail size={24}/> Business Email Generator</h2>
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label fw-bold">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="form-control form-control-lg"
              placeholder="e.g., The Daily Grind Coffee Shop"
            />
          </div>
          <div>
            <label className="form-label fw-bold">Website/Social Media Link (Optional)</label>
            <input
              type="text"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              className="form-control form-control-lg"
              placeholder="e.g., https://www.yourbusiness.com"
            />
          </div>
         <div>
  <label className="form-label fw-bold small">Contact Information (Optional)</label>
  <textarea
    rows="2"
    value={contactInfo}
    onChange={(e) => setContactInfo(e.target.value)}
    className="form-control form-control-sm"
    placeholder="e.g., 123 Main St, Anytown | (555) 123-4567"
  />
</div>

          <div>
            <label className="form-label fw-bold">Email Topic</label>
            <input
              type="text"
              value={emailTopic}
              onChange={(e) => setEmailTopic(e.target.value)}
              className="form-control form-control-lg"
              placeholder="e.g., Springtime specials, new loyalty program"
            />
          </div>
          <hr className="my-3" />
          <h3 className="h5 fw-bold text-dark">Advanced Options</h3>
          <div>
            <label className="form-label fw-bold">Type of Business Email</label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="form-select form-select-lg"
            >
              {emailTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {emailType === 'Invitation Emails' && (
            <div className="card card-body bg-light mt-3 p-4">
              <h4 className="h6 fw-bold mb-3">Invitation Details</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input type="date" value={invitationDate} onChange={(e) => setInvitationDate(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Time</label>
                  <input type="time" value={invitationTime} onChange={(e) => setInvitationTime(e.target.value)} className="form-control" />
                </div>
                <div className="col-12">
                  <label className="form-label">Venue</label>
                  <input type="text" value={invitationVenue} onChange={(e) => setInvitationVenue(e.target.value)} className="form-control" placeholder="e.g., 123 Main Street, Anytown" />
                </div>
                <div className="col-12">
                  <label className="form-label">Events (Optional)</label>
                  <textarea rows="2" value={invitationEvents} onChange={(e) => setInvitationEvents(e.target.value)} className="form-control" placeholder="e.g., Live music, keynote speaker, networking session" />
                </div>
              </div>
            </div>
          )}

          {emailType === 'Offer or Appointment Letters' && (
            <div className="card card-body bg-light mt-3 p-4">
              <h4 className="h6 fw-bold mb-3">Offer Details</h4>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Recipient Name</label>
                  <input type="text" value={offerRecipient} onChange={(e) => setOfferRecipient(e.target.value)} className="form-control" placeholder="e.g., Jane Doe" />
                </div>
                <div className="col-12">
                  <label className="form-label">Position / Role</label>
                  <input type="text" value={offerRole} onChange={(e) => setOfferRole(e.target.value)} className="form-control" placeholder="e.g., Senior Software Engineer" />
                </div>
                <div className="col-12">
                  <label className="form-label">Salary / Terms</label>
                  <input type="text" value={offerSalary} onChange={(e) => setOfferSalary(e.target.value)} className="form-control" placeholder="e.g., $90,000 per year, plus benefits" />
                </div>
              </div>
            </div>
          )}

          {emailType === 'Feedback Request Emails' && (
            <div className="card card-body bg-light mt-3 p-4">
              <h4 className="h6 fw-bold mb-3">Feedback Details</h4>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Product/Service Name</label>
                  <input type="text" value={feedbackProduct} onChange={(e) => setFeedbackProduct(e.target.value)} className="form-control" placeholder="e.g., Online Ordering System" />
                </div>
                <div className="col-12">
                  <label className="form-label">Feedback Form Link</label>
                  <input type="url" value={feedbackLink} onChange={(e) => setFeedbackLink(e.target.value)} className="form-control" placeholder="e.g., https://yourbusiness.com/feedback" />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateEmail}
            disabled={loadingEmail || !emailTopic}
            className="btn btn-primary btn-lg w-100 mt-4 rounded-pill fw-bold"
          >
            {loadingEmail ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <Loader2 className="animate-spin" size={24} strokeWidth={2.5} />
                Drafting Email...
              </span>
            ) : (
              'Generate Creative Email'
            )}
          </button>
          
          {generatedEmail && (
            <div className="card mt-4 p-4 bg-light">
              <h3 className="h5 fw-bold mb-3">Drafted Email Preview:</h3>
             <div className="card card-body bg-white border-secondary">
                <pre
                className="m-0"
                style={{
                whiteSpace: 'pre-wrap',
                fontSize: '1.25rem',       // Increased font size (~20px)
                lineHeight: '1.8',
                fontFamily: 'inherit',
                color: '#333',
                }}>
    <ReactMarkdown>{generatedEmail}</ReactMarkdown>
  </pre>
</div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

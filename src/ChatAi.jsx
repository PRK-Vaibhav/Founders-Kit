import React, { useState, useEffect, useRef } from 'react';

// The main App component that contains all the chat logic and UI.
// This version is styled with Bootstrap classes.
const App = () => {
  // State for the chat history, storing messages from both the user and the bot.
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: "Hello! I'm an AI assistant. How can I help you today?" },
  ]);
  // State for the current user's input.
  const [userInput, setUserInput] = useState('');
  // State to track if a bot response is being generated.
  const [loadingChat, setLoadingChat] = useState(false);
  // State to store any error messages that occur.
  const [error, setError] = useState(null);

  // A ref to the chat container element for auto-scrolling to the bottom.
  const chatContainerRef = useRef(null);

  // The base URL for the Gemini API.
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";
  const apiKey = "AIzaSyC1fJX3VJlyF5galObc0vYmFbbtW3rCkTs";

  // Function to handle sending a message.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loadingChat) return;

    const userMessage = { role: 'user', text: userInput, id: Date.now() };
    const updatedChatHistory = [...chatHistory, userMessage];
    setChatHistory(updatedChatHistory);
    setUserInput('');
    setLoadingChat(true);
    setError(null);

    const makeApiCall = async (retries = 0) => {
      try {
        const chatHistoryForAPI = updatedChatHistory.map(message => ({
          role: message.role === 'user' ? 'user' : 'model',
          parts: [{ text: message.text }],
        }));

        // Modify the last user message to include the length constraint for the API call.
        const lastMessageIndex = chatHistoryForAPI.length - 1;
        if (chatHistoryForAPI[lastMessageIndex].role === 'user') {
          const originalText = chatHistoryForAPI[lastMessageIndex].parts[0].text;
          chatHistoryForAPI[lastMessageIndex].parts[0].text = `Respond to the following in not more than 100 words: "${originalText}"`;
        }

        const payload = { contents: chatHistoryForAPI };

        const response = await fetch(API_URL + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();
        const botResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botResponse) {
          setChatHistory(prevHistory => [...prevHistory, { role: 'bot', text: botResponse, id: Date.now() }]);
        } else {
          throw new Error("Invalid API response format.");
        }
      } catch (err) {
        if (retries < 3) {
          const delay = Math.pow(2, retries) * 1000;
          setTimeout(() => makeApiCall(retries + 1), delay);
        } else {
          console.error("Failed to fetch bot response after multiple retries:", err);
          setError("Failed to get a response. Please try again.");
        }
      } finally {
        // Ensure loading is set to false only after the final attempt.
        if (retries === 0 || retries >= 3) {
          setLoadingChat(false);
        }
      }
    };
    makeApiCall();
  };

  // useEffect hook to scroll the chat history to the bottom whenever it's updated.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Component for displaying an error modal.
  const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-body py-4">
              <p className="text-danger mb-4">{message}</p>
              <button onClick={onClose} className="btn btn-danger">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // Main container
    <div className="d-flex flex-column vh-100 bg-dark text-light p-3">
      {/* Chat window */}
      <div className="d-flex flex-column flex-grow-1 container bg-light bg-opacity-10 rounded shadow-lg overflow-hidden p-0">
        {/* Header */}
        <header className="p-3 bg-primary text-white text-center h5">
          FK ChatBot
        </header>

        {/* Chat History Container */}
        <div ref={chatContainerRef} className="flex-grow-1 overflow-y-auto p-3">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-3 rounded shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-white'
                }`}
                style={{ maxWidth: '75%' }}
              >
                <span>{message.text}</span>
              </div>
            </div>
          ))}
          {/* Loading indicator */}
          {loadingChat && (
            <div className="d-flex justify-content-start mb-3">
              <div className="p-3 rounded shadow-sm bg-secondary" style={{ maxWidth: '75%' }}>
                <div className="placeholder-glow">
                  <span className="placeholder col-12"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Input Form */}
        <footer className="p-3 border-top border-secondary">
          <form onSubmit={handleSendMessage} className="d-flex align-items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message here..."
              className="form-control rounded-pill me-2 bg-dark text-light border-secondary"
              disabled={loadingChat}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-circle p-2"
              disabled={loadingChat || !userInput.trim()}
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>

      {/* Error Modal */}
      <ErrorModal message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default App;
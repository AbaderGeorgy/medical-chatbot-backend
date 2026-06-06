import Header from "../components/Header.jsx";
import { useChatbotConversation, DEFAULT_INITIAL_MESSAGE } from "../hooks/useChatbotConversation";

export default function Chatbot() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesContainerRef,
    sendMessage,
    handleSubmit,
    canSend,
  } = useChatbotConversation(DEFAULT_INITIAL_MESSAGE);

  return (
    <>
      <Header />
      <main className="chat-page">
        <div className="container">
          <div className="page-header">
            <h1>AI Medical Assistant</h1>
            <p className="page-subtitle">
              Ask questions about your medical results and get instant AI-powered answers
            </p>
          </div>
          <div className="chat-container">
            <div className="chat">
              <div className="chat__header">
                <div className="chat-header-content">
                  <div className="chat-avatar">🤖</div>
                  <div>
                    <div className="chat-title">Skeleti-X</div>
                    <div className="chat-status">Online • Ready to help</div>
                  </div>
                </div>
              </div>
              <div className="chat__messages" id="chatMessages" ref={messagesContainerRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === "user" ? "message--user" : ""}`}
                  >
                    <div className="message__bubble">{message.text}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message">
                    <div className="message__bubble">Typing...</div>
                  </div>
                )}
              </div>
              {error && (
                <p className="chat-error" role="alert">
                  {error}
                </p>
              )}
              <form className="chat__input" onSubmit={handleSubmit}>
                <input
                  id="chatInput"
                  placeholder="Ask about your medical results..."
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isLoading}
                />
                <button className="btn_2 btn--primary" id="sendMessage" type="submit" disabled={!canSend}>
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <div className="quick-questions">
        <h3>Quick Questions</h3>
        <div className="quick-buttons">
          <button
            type="button"
            className="btn btn--secondary chat-suggestion"
            onClick={() => sendMessage("What do my lab values mean?")}
            disabled={isLoading}
          >
            What do my lab values mean?
          </button>
          <button
            type="button"
            className="btn btn--secondary chat-suggestion"
            onClick={() => sendMessage("How accurate are the results?")}
            disabled={isLoading}
          >
            How accurate are the results?
          </button>
          <button
            type="button"
            className="btn btn--secondary chat-suggestion"
            onClick={() => sendMessage("Is my data secure?")}
            disabled={isLoading}
          >
            Is my data secure?
          </button>
          <button
            type="button"
            className="btn btn--secondary chat-suggestion"
            onClick={() => sendMessage("When should I see a doctor?")}
            disabled={isLoading}
          >
            When should I see a doctor?
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer_section footer_brand">
              <div className="footer__logo">
                <img
                  src="https://i.postimg.cc/dVxJWzgh/11111.png"
                  alt="MedLab Logo"
                  className="logo__img"
                />
                <span className="logo__text" style={{ color: "white" }}>
                  Skeleti-
                  <span className="edit" style={{ color: "#0EA5E9" }}>
                    <img src="https://i.postimg.cc/dVxJWzgh/11111.png" className="logo_img_1" alt="" />
                  </span>
                </span>
              </div>
              <p className="footer__description">
                Transform your medical imaging with AI-powered analysis. Fast, accurate, and patient-friendly results.
              </p>

              <div className="footer__social">
                <h5>Follow Us</h5>
                <div className="social-links">
                  <a href="#" className="social-link" target="_blank" rel="noreferrer">
                    🐦 Twitter
                  </a>
                  <a href="#" className="social-link" target="_blank" rel="noreferrer">
                    🗺 LinkedIn
                  </a>
                  <a href="#" className="social-link" target="_blank" rel="noreferrer">
                    📱 Facebook
                  </a>
                </div>
              </div>
            </div>

            <div className="footer__section">
              <h4>Quick Links</h4>
              <ul className="footer__links">
                <li>
                  <a href="#" data-page="upload">
                    Upload Files
                  </a>
                </li>
                <li>
                  <a href="#" data-page="dashboard">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" data-page="reports">
                    View Reports
                  </a>
                </li>
                <li>
                  <a href="#" data-page="chat">
                    AI Assistant
                  </a>
                </li>
                <li>
                  <a href="#" data-page="education">
                    Education Center
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__section">
              <h4>Resources</h4>
              <ul className="footer__links">
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Medical Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Research Papers
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__section">
              <h4>Newsletter</h4>
              <p className="footer__newsletter-text">
                Stay updated with the latest in AI medical technology
              </p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button type="button" className="newsletter-btn">
                  Subscribe
                </button>
              </div>

              <div className="footer__badges">
                <div className="compliance-badge">
                  <span className="badge-icon">🛡️</span>
                  <span className="badge-text">HIPAA Compliant</span>
                </div>
                <div className="compliance-badge">
                  <span className="badge-icon">🏆</span>
                  <span className="badge-text">FDA Approved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__bottom-content">
              <div className="footer__copyright">
                <p>&copy; 2025 Skeleti-x. All rights reserved.</p>
              </div>
              <div className="footer__legal">
                <a href="#" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  Cookie Policy
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

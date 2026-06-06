import { useState } from "react";
import { useChatbotConversation, DEFAULT_INITIAL_MESSAGE } from "../hooks/useChatbotConversation";
import "../styles/chatbot-widget.css";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesContainerRef,
    handleSubmit,
    canSend,
  } = useChatbotConversation(DEFAULT_INITIAL_MESSAGE);

  return (
    <div className="chatbot-widget-root">
      {isOpen && (
        <section className="chatbot-widget-popup" aria-label="Chat assistant window">
          <header className="chatbot-widget-header">
            <div>
              <strong>Skeleti-X Assistant</strong>
              <p>Online</p>
            </div>
            <button
              type="button"
              className="chatbot-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div className="chatbot-widget-messages" ref={messagesContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-widget-message ${
                  message.role === "user" ? "chatbot-widget-message--user" : ""
                }`}
              >
                <div className="chatbot-widget-bubble">{message.text}</div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-widget-message">
                <div className="chatbot-widget-bubble">Typing...</div>
              </div>
            )}
          </div>

          {error && (
            <p className="chatbot-widget-error" role="alert">
              {error}
            </p>
          )}

          <form className="chatbot-widget-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your results..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!canSend}>
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-widget-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        🤖
      </button>
    </div>
  );
}

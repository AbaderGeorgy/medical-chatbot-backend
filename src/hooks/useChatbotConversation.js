import { useMemo, useRef, useState } from "react";

const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL || "http://127.0.0.1:5000";

export const DEFAULT_INITIAL_MESSAGE =
  "Hello! I'm your AI medical assistant. I can help explain medical terms and test-related questions. How can I assist you today?";

export function useChatbotConversation(initialBotMessage = DEFAULT_INITIAL_MESSAGE) {
  const [messages, setMessages] = useState([{ id: 1, role: "bot", text: initialBotMessage }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesContainerRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const scrollMessagesToBottom = () => {
    const node = messagesContainerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  };

  const sendMessage = async (rawMessage) => {
    const trimmedMessage = rawMessage.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = { id: Date.now(), role: "user", text: trimmedMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    window.requestAnimationFrame(scrollMessagesToBottom);

    try {
      const response = await fetch(`${FLASK_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.reply || "Failed to get response from assistant.");
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: data.reply || "No response received." },
      ]);
      window.requestAnimationFrame(scrollMessagesToBottom);
    } catch (err) {
      const isNetworkError = err instanceof TypeError && err.message === "Failed to fetch";
      setError(
        isNetworkError
          ? "Cannot reach server. Make sure Flask is running on http://localhost:5000."
          : err.message || "Unable to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesContainerRef,
    sendMessage,
    handleSubmit,
    canSend,
  };
}

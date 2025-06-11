import React, { useState, useEffect } from "react";
import "./App.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Get current user from localStorage
  const currentUser = localStorage.getItem("user");

  // ✅ Load chat history specific to current user
  useEffect(() => {
    const userChatKey = `chatHistory_${currentUser}`; // ✅ User-specific key
    const savedMessages = JSON.parse(localStorage.getItem(userChatKey)) || [];
    
    setMessages(savedMessages.length > 0 ? savedMessages : [
      { user: "Bot", text: `Hi ${currentUser}! 👋 Welcome to our chatbot!`, timestamp: new Date().toLocaleTimeString() },
      { user: "Bot", text: "Type a product name to search, and I'll find similar matches!", timestamp: new Date().toLocaleTimeString() }
    ]);
  }, [currentUser]); // ✅ Re-run when user changes

  const handleSend = async () => {
    if (input.trim() !== "") {
      const newMessage = { user: "You", text: input, timestamp: new Date().toLocaleTimeString() };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ Important for session management
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        if (data.products?.length > 0) {
          const botMessages = [
            { user: "Bot", text: "Here are some similar products you might like:", timestamp: new Date().toLocaleTimeString() },
            ...data.products.map((product) => ({
              user: "Bot",
              text: `✨ ${product.name} - ₹${product.price} (${product.category})`,
              timestamp: new Date().toLocaleTimeString()
            }))
          ];
          const allMessages = [...updatedMessages, ...botMessages];
          setMessages(allMessages);

          // ✅ Save to user-specific localStorage key
          const userChatKey = `chatHistory_${currentUser}`;
          localStorage.setItem(userChatKey, JSON.stringify(allMessages));

        } else {
          // ✅ Try suggestions for unmatched queries
          const similarProducts = await fetch("http://127.0.0.1:5000/suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ query: input }),
          }).then((res) => res.json());

          let botResponse;
          if (similarProducts.suggestions.length > 0) {
            botResponse = [
              { user: "Bot", text: "No exact match found 😕, but check these similar products:", timestamp: new Date().toLocaleTimeString() },
              ...similarProducts.suggestions.map((suggestion) => ({
                user: "Bot",
                text: `🔍 Did you mean: ${suggestion}?`,
                timestamp: new Date().toLocaleTimeString()
              }))
            ];
          } else {
            botResponse = [
              { user: "Bot", text: "Sorry 😕, this product is not available.", timestamp: new Date().toLocaleTimeString() }
            ];
          }

          const allMessages = [...updatedMessages, ...botResponse];
          setMessages(allMessages);

          // ✅ Save to user-specific localStorage key
          const userChatKey = `chatHistory_${currentUser}`;
          localStorage.setItem(userChatKey, JSON.stringify(allMessages));
        }

      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = { user: "Bot", text: "Oops! Something went wrong.", timestamp: new Date().toLocaleTimeString() };
        const allMessages = [...updatedMessages, errorMessage];
        setMessages(allMessages);

        // ✅ Save to user-specific localStorage key
        const userChatKey = `chatHistory_${currentUser}`;
        localStorage.setItem(userChatKey, JSON.stringify(allMessages));
      }

      setInput("");
    }
  };

  // ✅ Reset Chat Functionality (user-specific)
  const handleReset = () => {
    const defaultMessages = [
      { user: "Bot", text: `Hi ${currentUser}! 👋 Welcome to our chatbot!`, timestamp: new Date().toLocaleTimeString() },
      { user: "Bot", text: "Type a product name to search, and I'll find similar matches!", timestamp: new Date().toLocaleTimeString() }
    ];
    setMessages(defaultMessages);
    
    // ✅ Clear user-specific chat history
    const userChatKey = `chatHistory_${currentUser}`;
    localStorage.setItem(userChatKey, JSON.stringify(defaultMessages));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Chatbot Interface</h2>

      {/* ✅ Reset Chat Button */}
      <button onClick={handleReset} className="reset-button" style={{ marginBottom: "10px" }}>Reset Chat</button>  

      <div className="chat-container">
        {messages.map((msg, index) => (
          <p key={index} className={msg.user === "You" ? "user-message" : "bot-message"}>
            <strong>{msg.user}: </strong>{msg.text} <small>({msg.timestamp})</small>
          </p>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()} // ✅ Enter key support
        placeholder="Ask something..."
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button onClick={handleSend} style={{ padding: "10px", marginTop: "10px" }}>Send</button>
    </div>
  );
}

export default Chatbot;
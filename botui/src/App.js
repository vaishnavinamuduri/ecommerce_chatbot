import React, { useState } from "react";
import "./App.css";


function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() !== "") {
      
      setMessages([...messages, { user: "You", text: input }]);

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        
        if (data.products && data.products.length > 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "Bot", text: "Here are some matching products:" },
            ...data.products.map((product) => ({
              user: "Bot",
              text: `${product.name} - ₹${product.price} (${product.category})`,
            })),
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "Bot", text: data.answer || "Sorry, no matching products found." },
          ]);
        }

      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prevMessages) => [...prevMessages, { user: "Bot", text: "Oops! Something went wrong." }]);
      }

      setInput(""); 
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Chatbot Interface</h2>
      <div className="chat-container">
  {messages.map((msg, index) => (
    <p key={index} className={msg.user === "You" ? "user-message" : "bot-message"}>
      <strong>{msg.user}: </strong>{msg.text}
    </p>
  ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button onClick={handleSend} style={{ padding: "10px", marginTop: "10px" }}>Send</button>
    </div>
  );
}

export default Chatbot;

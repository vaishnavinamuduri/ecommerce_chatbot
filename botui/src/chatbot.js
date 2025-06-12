import React, { useState, useEffect } from "react";
import "./App.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
      // ✅ Use state values instead of DOM elements
      const validMaxPrice = maxPrice && !isNaN(maxPrice) ? parseInt(maxPrice, 10) : null;

      // ✅ Send API request with filters
      const response = await fetch(`http://127.0.0.1:5000/products?search=${input}&category=${selectedCategory}&max_price=${validMaxPrice || ""}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      console.log("Filtered API response: ", data);

      if (data.length > 0) {
        // ✅ Apply frontend-side filtering to ensure correct price constraints
        const filteredResults = data.filter(product => !validMaxPrice || product.price <= validMaxPrice);
        console.log("After filtering in frontend:", filteredResults);

        const botMessages = [
          { user: "Bot", text: "Filtered products for your search:", timestamp: new Date().toLocaleTimeString() },
          ...filteredResults.map((product) => ({
            user: "Bot",
            text: `✨ ${product.name} - ₹${product.price} (${product.category})`,
            timestamp: new Date().toLocaleTimeString()
          }))
        ];
        
        const finalMessages = [...updatedMessages, ...botMessages];
        setMessages(finalMessages);
        localStorage.setItem(`chatHistory_${currentUser}`, JSON.stringify(finalMessages));
      } else {
        const noResultsMessage = { user: "Bot", text: "No matching products found. Try adjusting your filters!", timestamp: new Date().toLocaleTimeString() };
        const finalMessages = [...updatedMessages, noResultsMessage];
        setMessages(finalMessages);
        localStorage.setItem(`chatHistory_${currentUser}`, JSON.stringify(finalMessages));
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { user: "Bot", text: "Oops! Something went wrong.", timestamp: new Date().toLocaleTimeString() };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem(`chatHistory_${currentUser}`, JSON.stringify(finalMessages));
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
    
    // ✅ Reset filters too
    setSelectedCategory("");
    setMaxPrice("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Chatbot Interface</h2>

      {/* ✅ Filter Controls */}
      <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h4>Filters:</h4>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div>
            <label htmlFor="category">Category: </label>
            <select 
              id="category" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "5px" }}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="books">Books</option>
              <option value="groceries">Groceries</option>
              <option value="accessories">Accessories</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="price">Max Price: ₹</label>
            <input 
              type="number" 
              id="price"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Enter max price"
              style={{ padding: "5px", width: "120px" }}
            />
          </div>
        </div>
      </div>

      {/* ✅ Reset Chat Button */}
      <button onClick={handleReset} className="reset-button" style={{ marginBottom: "10px" }}>
        Reset Chat & Filters
      </button>  

      <div className="chat-container" style={{ 
        height: "300px", 
        overflowY: "scroll", 
        border: "1px solid #ccc", 
        padding: "10px", 
        marginBottom: "10px" 
      }}>
        {messages.map((msg, index) => (
          <p key={index} className={msg.user === "You" ? "user-message" : "bot-message"}>
            <strong>{msg.user}: </strong>{msg.text} <small>({msg.timestamp})</small>
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()} // ✅ Enter key support
          placeholder="Ask something..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={handleSend} style={{ padding: "10px" }}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
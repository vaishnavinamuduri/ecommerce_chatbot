import React, { useState, useEffect } from "react";
import "./App.css"; 
import Login from "./login.js";
import Logout from "./logout.js";
import Chatbot from "./chatbot.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "null" && savedUser !== "") {
        setUser(savedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome {user}!</h2>
          
          {/* ✅ Only the Chatbot component (which has its own filters) */}
          <Chatbot />

          <Logout setUser={setUser} />
        </>
      ) : (
        <Login setUser={setUser} />
      )}
    </div>
  );
}

export default App;
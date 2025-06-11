import React, { useState, useEffect } from "react";
import "./App.css"; 
import Login from "./login.js";
import Logout from "./logout.js";
import Chatbot from "./chatbot.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Properly check authentication on app startup
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      console.log("Checking auth - savedUser:", savedUser); // ✅ Debug log
      
      if (savedUser && savedUser !== "null" && savedUser !== "") {
        setUser(savedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Show loading while checking auth
  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  console.log("Current user state:", user); // ✅ Debug log

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome {user}!</h2>
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
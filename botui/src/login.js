import React, { useState } from "react";

function Login({ setUser }) {  // ✅ Make sure to destructure setUser prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store user info in localStorage and update state
        localStorage.setItem("user", username); // or data.user if your backend returns user info
        setUser(username); // ✅ This will trigger the App component to show chatbot
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔒 Login to Continue</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "200px" }}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "200px" }}
      />
      <button 
        onClick={handleLogin}
        style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
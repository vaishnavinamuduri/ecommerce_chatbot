import React from "react";

function Logout({ setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Clear user from localStorage
    setUser(null); // ✅ Update state to show login page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button 
        onClick={handleLogout}
        style={{ 
          padding: "10px 20px", 
          backgroundColor: "#f04e4e", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer" 
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
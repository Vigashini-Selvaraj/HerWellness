import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Today from "./components/Today";
import Home from "./components/Home";
import Insights from "./components/Insights";
import Article from "./components/Article"; 
import Chat from "./components/Chat"; // ✅ chatbot page

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load currentUser from localStorage
  useEffect(() => {
    try {
      const user = localStorage.getItem("currentUser");
      if (user) setCurrentUser(user);
    } catch (err) {
      console.error("Error loading user from localStorage", err);
    }
    setLoading(false); // done loading
  }, []);

  if (loading) return <div>Loading...</div>; // better UX

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/today" element={<Today currentUser={currentUser} />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/calendar" element={<Calendar currentUser={currentUser} />} />
        <Route path="/chat" element={<Chat />} /> {/* ✅ new Chat route */}
      </Routes>
    </Router>
  );
}

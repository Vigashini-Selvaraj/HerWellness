import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Today from "./components/Today";
import Insights from "./components/Insights";
import Calendar from "./components/Calendar";
import Chat from "./components/Chat";
import Article from "./components/Article";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load currentUser from localStorage once on mount
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={<Home currentUser={currentUser} />}
        />
        <Route
          path="/today"
          element={<Today currentUser={currentUser} />}
        />
        <Route path="/insights" element={<Insights />} />
          <Route path="/article/:id" element={<Article />} />
        <Route
          path="/calendar"
          element={<Calendar currentUser={currentUser} />}
        />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

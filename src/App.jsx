import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Insights from "./components/Insights";
import Home from "./components/Home";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || null
  );

  useEffect(() => {
    // Only show splash if not seen
    const splashShown = localStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  return (
    <Router>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar currentUser={currentUser} />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

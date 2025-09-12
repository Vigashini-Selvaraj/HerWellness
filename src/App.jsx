import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Insights from "./components/Insights";
import Home from "./components/Home";
import TodayPage from "./components/Today";
import "./App.css"; // make sure it's imported

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || null
  );

  useEffect(() => {
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
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/today" element={<TodayPage currentUser={currentUser} />} /> {/* ADD THIS */}
              <Route path="/calendar" element={<Calendar currentUser={currentUser} />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}


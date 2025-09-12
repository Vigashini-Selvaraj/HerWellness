import React, { useState, useEffect } from "react";
import "./Calendar.css";

const Calendar = ({ currentUser }) => {
  const today = new Date();
  const startYear = today.getFullYear();
  const endYear = startYear + 5;

  const [selectedDates, setSelectedDates] = useState([]);

  // Load saved dates for this user whenever they log in
  useEffect(() => {
    if (!currentUser) {
      setSelectedDates([]); // logged out → show nothing
      return;
    }
    const saved = JSON.parse(localStorage.getItem("selectedDates")) || {};
    setSelectedDates(saved[currentUser] || []);
  }, [currentUser]);

  // Save user’s dates whenever they change
  useEffect(() => {
    if (!currentUser) return;
    const saved = JSON.parse(localStorage.getItem("selectedDates")) || {};
    saved[currentUser] = selectedDates;
    localStorage.setItem("selectedDates", JSON.stringify(saved));
  }, [selectedDates, currentUser]);

  const toggleDate = (dateStr) => {
    if (!currentUser) {
      alert("Please login to mark dates!");
      return;
    }
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const renderMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });

    return (
      <div className="month-card" key={`${year}-${month}`}>
        <h4>
          {monthName} {year}
        </h4>
        <div className="days-grid">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dateStr = `${year}-${month + 1}-${i + 1}`;
            const isSelected = selectedDates.includes(dateStr);
            return (
              <div
                key={dateStr}
                className={`day ${isSelected ? "selected" : ""}`}
                onClick={() => toggleDate(dateStr)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const months = [];
  for (let y = startYear; y < endYear; y++) {
    for (let m = 0; m < 12; m++) {
      months.push(renderMonth(y, m));
    }
  }

  return <div className="calendar-container">{months}</div>;
};

export default Calendar;

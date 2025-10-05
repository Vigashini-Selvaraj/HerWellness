// frontend/src/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { fetchMarkedDates, markDate } from "../api/calendar";

const Calendar = ({ currentUser }) => {
  const today = new Date();
  const startYear = 2025;
  const endYear = startYear + 5;

  const [selectedDates, setSelectedDates] = useState([]);
  const [predictedDate, setPredictedDate] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);

  useEffect(() => {
    if (!currentUser?.email) {
      setSelectedDates([]);
      setPredictedDate(null);
      setOvulationDate(null);
      return;
    }

    fetchMarkedDates(currentUser.email)
      .then((data) => {
        const dates = data.marked || [];
        setSelectedDates(dates);
        updatePrediction(dates);
      })
      .catch((err) => console.error(err.message));
  }, [currentUser]);

  const formatDate = (y, m, d) => new Date(y, m, d).toISOString().split("T")[0];

  const updatePrediction = (markedArray) => {
    if (!markedArray || markedArray.length === 0) {
      setPredictedDate(null);
      setOvulationDate(null);
      return;
    }

    const sorted = [...markedArray].sort();
    const lastMarked = new Date(sorted[sorted.length - 1]);

    // Ovulation = last marked date + 14 days
    const nextOvulation = new Date(lastMarked);
    nextOvulation.setDate(nextOvulation.getDate() + 14);

    // Next period = last marked date + 28 days
    const nextPrediction = new Date(lastMarked);
    nextPrediction.setDate(nextPrediction.getDate() + 28);

    setOvulationDate(nextOvulation.toISOString().split("T")[0]);
    setPredictedDate(nextPrediction.toISOString().split("T")[0]);
  };

  const toggleDate = async (y, m, d) => {
    if (!currentUser?.email) return alert("Please login first.");
    const date = formatDate(y, m, d);
    try {
      const res = await markDate(currentUser.email, date);
      const dates = res.marked || [];
      setSelectedDates(dates);
      updatePrediction(dates);
    } catch (err) {
      console.error("Mark error:", err.message);
      alert("Failed to mark date. Make sure backend is running.");
    }
  };

  const renderMonth = (y, m) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const monthName = new Date(y, m).toLocaleString("default", { month: "long" });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${y}-${m}-${i}`} className="day empty" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const f = formatDate(y, m, i);
      const isMarked = selectedDates.includes(f);
      const isToday =
        today.getFullYear() === y && today.getMonth() === m && today.getDate() === i;
      const isPredicted = predictedDate === f;
      const isOvulation = ovulationDate === f;

      days.push(
        <div
          key={f}
          className={`day
            ${isMarked ? "marked" : ""}
            ${isToday ? "today" : ""}
            ${isPredicted ? "predicted" : ""}
            ${isOvulation ? "ovulation" : ""}`}
          onClick={() => toggleDate(y, m, i)}
        >
          {i}
        </div>
      );
    }

    return (
      <div key={`${y}-${m}`} className="month-card">
        <h4>{monthName} {y}</h4>
        <div className="days-grid">{days}</div>
      </div>
    );
  };

  const months = [];
  for (let y = startYear; y < endYear; y++) {
    for (let m = 0; m < 12; m++) {
      months.push(renderMonth(y, m));
    }
  }

  return (
    <div className="container-fluid" style={{ marginTop: "80px" }}>
      <h2 className="text-center text-danger fw-bold mt-2 mb-2 px-2">
        Log your periods today for a healthier tomorrow 💖
      </h2>
      <div className="calendar-container mt-2">{months}</div>
      <div className="predictions mt-4 text-center">
        {ovulationDate && <p>Next Ovulation: <strong>{ovulationDate}</strong></p>}
        {predictedDate && <p>Next Period Prediction: <strong>{predictedDate}</strong></p>}
      </div>
    </div>
  );
};

export default Calendar;

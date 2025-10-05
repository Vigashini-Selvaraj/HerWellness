// frontend/src/components/Today.jsx
import React, { useState, useEffect } from "react";
import { fetchMarkedDates, markDate } from "../api/calendar";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import "./Today.css";

const API_KEY = "AIzaSyCYfjwmb7PCcQdR1WhHYoAsq7lPct35QFw";
const genAI = new GoogleGenerativeAI(API_KEY);

const TestButton = ({ label, icon, isActive, onClick }) => (
  <button className={`chip ${isActive ? "active" : ""}`} onClick={onClick}>
    <span className="chip-icon">{icon}</span> {label}
  </button>
);

export default function Today({ currentUser }) {
  // --- STATE ---
  const [periodDates, setPeriodDates] = useState([]);
  const [predictedDate, setPredictedDate] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [daysToNextPeriod, setDaysToNextPeriod] = useState(null);
  const [mood, setMood] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [discharge, setDischarge] = useState(null);
  const [digestion, setDigestion] = useState(null);
  const [pregnancyTest, setPregnancyTest] = useState(false);
  const [ovulationTest, setOvulationTest] = useState(false);
  const [diet, setDiet] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [activity, setActivity] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [water, setWater] = useState(0);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- SAMPLE DATA FOR CHARTS ---
  const weightWaterData = [
    { date: "2025-10-01", weight: 60, water: 8 },
    { date: "2025-10-02", weight: 60.2, water: 7 },
    { date: "2025-10-03", weight: 60.1, water: 9 },
    { date: "2025-10-04", weight: 60.3, water: 8 },
  ];

  const symptomFrequency = [
    { symptom: "Cramps", count: 5 },
    { symptom: "Headache", count: 3 },
    { symptom: "Fatigue", count: 6 },
    { symptom: "Bloating", count: 4 },
  ];

  const moods = ["😊","😔","😡","😭","😴","😍","😌","🤒","😱","🙌"];
  const allSymptoms = ["Cramps","Headache","Mood swings","Fatigue","Bloating","Acne","Back pain","Anxiety","Nausea","Insomnia"];
  const dischargeTypes = [
    {label: "Sticky", icon: "🟤"},
    {label: "Creamy", icon: "🤍"},
    {label: "Watery", icon: "💧"},
    {label: "Egg white", icon: "🥚"},
    {label: "Brown", icon: "🟫"},
    {label: "Bloody", icon: "❤️"},
  ];
  const digestionTypes = [
    {label: "Normal", icon: "✅"},
    {label: "Constipation", icon: "💩"},
    {label: "Diarrhea", icon: "🚰"},
    {label: "Indigestion", icon: "🤢"},
  ];

  const toggleSymptom = (sym) => {
    setSymptoms(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (!currentUser?.email) return;
    fetchMarkedDates(currentUser.email)
      .then(data => {
        const sorted = (data.marked || []).sort((a,b)=>new Date(a)-new Date(b));
        setPeriodDates(sorted);

        if (sorted.length) {
          const lastPeriod = new Date(sorted[sorted.length-1]);
          const nextPeriod = new Date(lastPeriod);
          nextPeriod.setDate(nextPeriod.getDate()+28);
          setPredictedDate(nextPeriod.toISOString().split("T")[0]);

          const today = new Date();
          const diffDays = Math.round((today - lastPeriod)/(1000*60*60*24));
          if(diffDays<=5) setCurrentPhase("Period");
          else if(diffDays<=13) setCurrentPhase("Follicular");
          else if(diffDays<=15) setCurrentPhase("Ovulation");
          else setCurrentPhase("Luteal");

          const daysLeft = Math.round((nextPeriod - today)/(1000*60*60*24));
          setDaysToNextPeriod(daysLeft>=0?daysLeft:0);
        }
      }).catch(err=>console.error(err));
  }, [currentUser]);

  // --- FUNCTIONS ---
  const logTodayPeriod = async () => {
    if(!currentUser?.email) return alert("Please login.");
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await markDate(currentUser.email, today);
      setPeriodDates(res.marked || []);
      const next = new Date();
      next.setDate(next.getDate()+28);
      setPredictedDate(next.toISOString().split("T")[0]);
      setCurrentPhase("Period");
      setDaysToNextPeriod(28);
    } catch(err) { console.error(err); alert("Failed to log period."); }
  };

  const generateSuggestions = async () => {
    if(!currentUser?.email) return alert("Please login.");
    setLoading(true);
    const prompt = `
User submitted today's wellness data:
Mood: ${mood||"N/A"}
Symptoms: ${symptoms.join(",")||"None"}
Discharge: ${discharge||"N/A"}
Digestion: ${digestion||"N/A"}
Diet: Breakfast: ${diet.breakfast}, Lunch: ${diet.lunch}, Dinner: ${diet.dinner}
Activity: ${activity||"N/A"}
Weight: ${weight||"N/A"}, Height: ${height||"N/A"}
Water: ${water} glasses
Pregnancy test: ${pregnancyTest?"Yes":"No"}
Ovulation test: ${ovulationTest?"Yes":"No"}

Provide 3 points: Personalized Do's, Don'ts, Motivational Thought. Avoid markdown, headers, special characters.
`;
    try {
      const model = genAI.getGenerativeModel({
        model:"gemini-2.5-flash",
        safetySettings:[
          { category:HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold:HarmBlockThreshold.BLOCK_NONE },
          { category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold:HarmBlockThreshold.BLOCK_NONE },
          { category:HarmCategory.HARM_CATEGORY_HARASSMENT, threshold:HarmBlockThreshold.BLOCK_NONE },
          { category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold:HarmBlockThreshold.BLOCK_NONE },
        ]
      });
      const result = await model.generateContent(prompt);
      let text = await (await result.response).text();
      text = text.replace(/[#*>]/g,"").trim();
      setSuggestions(text);
    } catch(err){ console.error(err); setSuggestions("Could not generate suggestions."); }
    finally { setLoading(false); }
  };

  return (
    <div className="today-page">
      {/* --- PERIOD CARD --- */}
      <div className="card period-card">
        <h2>🩸 Cycle Progress</h2>
        <div className="cycle-info-grid">
          <div>
            <p className="label">Phase:</p>
            <p className="value"><strong>{currentPhase||"N/A"}</strong></p>
          </div>
          <div>
            <p className="label">Next Period:</p>
            <p className="value"><strong>{predictedDate||"N/A"}</strong></p>
          </div>
          <div>
            <p className="label">Days Remaining:</p>
            <p className="value"><strong>{daysToNextPeriod!==null?daysToNextPeriod:"N/A"}</strong></p>
          </div>
        </div>
        <button className="log-btn" onClick={logTodayPeriod}>🗓️ Log Period Today</button>
      </div>

      <h1 className="page-title">✨ Today’s Wellness Dashboard ✨</h1>

      {/* --- DASHBOARD GRID --- */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-column tracker-inputs">
          <div className="card">
            <h2>😌 Track Mood</h2>
            <div className="chip-list">{moods.map((m,i)=><button key={i} className={`chip mood ${mood===m?"active":""}`} onClick={()=>setMood(m)}>{m}</button>)}</div>
          </div>

          <div className="card">
            <h2>🤕 Track Symptoms</h2>
            <div className="chip-list">{allSymptoms.map((s,i)=><button key={i} className={`chip ${symptoms.includes(s)?"active":""}`} onClick={()=>toggleSymptom(s)}>{s}</button>)}</div>
          </div>

          <div className="card">
            <h2>💧 Discharge Type</h2>
            <div className="chip-list">{dischargeTypes.map((d,i)=><button key={i} className={`chip ${discharge===d.label?"active":""}`} onClick={()=>setDischarge(d.label)}>{d.icon} {d.label}</button>)}</div>
          </div>

          <div className="card">
            <h2>🍽️ Digestion Status</h2>
            <div className="chip-list">{digestionTypes.map((d,i)=><button key={i} className={`chip ${digestion===d.label?"active":""}`} onClick={()=>setDigestion(d.label)}>{d.icon} {d.label}</button>)}</div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column data-insights">
          {/* Weight & Water Chart */}
          <div className="graph-card">
            <h2>📈 Weight & Water Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightWaterData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#ff6b8f" strokeWidth={2} />
                <Line type="monotone" dataKey="water" stroke="#42a5f5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Symptom Frequency Chart */}
          <div className="graph-card">
            <h2>📊 Symptom Frequency</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={symptomFrequency} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symptom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f70a45ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics */}
          <div className="card">
            <h2>📌 Daily Metrics</h2>
            <input type="number" placeholder="⚖️ Weight (kg)" value={weight} onChange={e=>setWeight(e.target.value)}/>
            <input type="number" placeholder="📏 Height (cm)" value={height} onChange={e=>setHeight(e.target.value)}/>
            <div className="water-tracker">
              <span>💧 Water Glasses: <strong>{water}</strong></span>
              <button onClick={()=>setWater(water+1)}>+1</button>
              <button onClick={()=>setWater(Math.max(0, water-1))}>-1</button>
            </div>
          </div>

          {/* Tests */}
          <div className="card">
            <h2>🧪 Tests Log</h2>
            <div className="chip-list">
              <TestButton label="Pregnancy Test" icon="🤰" isActive={pregnancyTest} onClick={()=>setPregnancyTest(p=>!p)}/>
              <TestButton label="Ovulation Test" icon="🔬" isActive={ovulationTest} onClick={()=>setOvulationTest(o=>!o)}/>
            </div>
          </div>
        </div>
      </div>

      {/* Diet & Activity */}
      <div className="card full-width wide-input-section">
        <h2>🥗 Diet & Activity</h2>
        <div className="diet-activity-grid">
          <div className="input-group">
            <label>🏃 Activity</label>
            <input type="text" placeholder="Yoga, Walk..." value={activity} onChange={e=>setActivity(e.target.value)}/>
          </div>
          <div className="input-group">
            <label>🍳 Breakfast</label>
            <input type="text" placeholder="Oatmeal, fruit" value={diet.breakfast} onChange={e=>setDiet({...diet, breakfast:e.target.value})}/>
          </div>
          <div className="input-group">
            <label>🥗 Lunch</label>
            <input type="text" placeholder="Salad, protein" value={diet.lunch} onChange={e=>setDiet({...diet, lunch:e.target.value})}/>
          </div>
          <div className="input-group">
            <label>🍲 Dinner</label>
            <input type="text" placeholder="Veggies, chicken" value={diet.dinner} onChange={e=>setDiet({...diet, dinner:e.target.value})}/>
          </div>
        </div>
      </div>

        {/* AI Suggestions */}
      <div className="card ai-suggestions-card">
        <h2>🧠 Personalized Insights</h2>
        <button className="generate-btn" onClick={generateSuggestions} disabled={loading}>
          {loading ? "Generating..." : "Get Personalized Daily Suggestions"}
        </button>
        {suggestions && (
          <div className="suggestions-box">
            <h3>💡 AI Suggestions:</h3>
            <ul>
              {suggestions.split("\n").filter(line => line.trim()!=="").map((line,i)=><li key={i}>{line}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

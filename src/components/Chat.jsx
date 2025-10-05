import React, { useState, useRef, useEffect } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import "./Chat.css";
import { featureFlows } from "../data/featureFlows";

// 🔑 Gemini API Setup
const API_KEY = "AIzaSyCYfjwmb7PCcQdR1WhHYoAsq7lPct35QFw"; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ChatApp() {
  const [selectedFeature, setSelectedFeature] = useState("Gemini Chat");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi love 💖, I’m your period support assistant. Tell me how you’re feeling today!",
    },
  ]);
  const [input, setInput] = useState("");
  const [qaIndex, setQaIndex] = useState(0);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedFeature]);

  // ✉️ Handle user message
  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (selectedFeature === "Gemini Chat") {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        });

        const prompt = `You are a friendly, supportive chatbot for a period & wellness app. 
        Be warm, comforting, and helpful in your tone. 
        The user said: "${input}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        setMessages((prev) => [...prev, { sender: "bot", text }]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Oops! Something went wrong." },
        ]);
      }
    }
  }

  // 🎯 Handle guided Q&A
  function handleOptionClick(option) {
    setMessages((prev) => [...prev, { sender: "user", text: option }]);
    const flow = featureFlows[selectedFeature];

    if (qaIndex + 1 < flow.length) {
      const nextStep = flow[qaIndex + 1];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: nextStep.question },
        ]);
      }, 500);
      setQaIndex(qaIndex + 1);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Thanks for your answers! ❤ I hope this helps you.",
          },
        ]);
      }, 500);
      setQaIndex(0);
    }
  }

  // 🛠 Handle feature selection
  function handleFeatureSelect(feature) {
    setSelectedFeature(feature);
    setMessages([
      {
        sender: "bot",
        text:
          feature === "Gemini Chat"
            ? "Hi love 💖, I’m your period support assistant. Tell me how you’re feeling today!"
            : featureFlows[feature][0].question,
      },
    ]);
    setQaIndex(0);
    setInput("");
  }

  return (
    <div className="chat-layout">
      {/* 🔹 Left Sidebar */}
      <div
        className="chat-sidebar"
        style={{
          marginTop: "80px", // 💖 keeps sidebar below navbar
        }}
      >
        {["Gemini Chat", "Mood Swings", "Cramps", "Late periods"].map(
          (feature) => (
            <div
              key={feature}
              className={`sidebar-item ${
                selectedFeature === feature ? "active" : ""
              }`}
              onClick={() => handleFeatureSelect(feature)}
            >
              {feature}
            </div>
          )
        )}
      </div>

      {/* 🔹 Right Chat Area */}
      <div className="chat-container">
        {/* Updated header text with spacing below navbar */}
        <div
          className="chat-header text-center fw-bold"
          style={{
            marginTop: "80px", // 🩷 keeps header below navbar
            fontSize: "1.5rem",
            color: "#ebdce3ff",
          }}
        >
          Hey love  chat with me
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input or Options */}
        {selectedFeature === "Gemini Chat" ? (
          <div className="input-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your feelings or ask a question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        ) : (
          <div className="options-container">
            {featureFlows[selectedFeature][qaIndex].options.map((opt) => (
              <button
                key={opt}
                className="option-btn"
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

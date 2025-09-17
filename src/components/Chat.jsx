import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import "./Chat.css";

const API_KEY = "AIzaSyD4j4zI8pLfjK57tSIP7eRDDPhuCwP7vWY"; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Chatbot() {
  console.log("Chatbot component mounted");
  
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi love 💖, I’m your period support assistant. Tell me how you’re feeling today!" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ]
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
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">🌸 Period Care Chatbot</div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your feelings or ask a question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { registerUser, loginUser } from "../api/auth";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // open login modal initially
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const res = await registerUser({ name, email, password });
      setMessage(res.message || res.error);
    } else {
      const res = await loginUser({ email, password });
      setMessage(res.message || res.error);
      if (res.user && onLogin) {
        onLogin(res.user);
        setIsModalOpen(false); // close modal after login
      }
    }
  };

  return isModalOpen ? (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-pink">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="auth-error">{message}</p>
        <div className="switch-auth">
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </span>
        </div>
      </div>
    </div>
  ) : null;
}

import React, { useState } from "react";
import { registerUser, loginUser } from "../api/auth";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const res = await registerUser({ name, email, password });
      setMessage(res.message || res.error);
    } else {
      const res = await loginUser({ email, password });
      setMessage(res.message || res.error);
      if (res.user && onLogin) {
        onLogin(res.user); // Pass user data to parent
      }
    }
  };

  return (
    <div>
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
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Need an account? Register"}
      </button>
    </div>
  );
}

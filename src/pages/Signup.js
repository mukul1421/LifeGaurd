import React, { useState } from "react";
import "./Auth.css";
import api from "../api";

export default function Signup({ onSuccess, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [strength, setStrength] = useState("");

  const checkStrength = (value) => {
    setPass(value);

    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 1) setStrength("Weak");
    else if (score === 2) setStrength("Medium");
    else setStrength("Strong");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await api.post("/users/signup", {
      name: username,
      email,
      password: pass,
    });

    localStorage.setItem("lg_user", JSON.stringify(res.data.user));
    localStorage.setItem("lg_token", res.data.token);
    localStorage.setItem("lg_auth", "true");

    onSuccess();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Signup</h1>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => checkStrength(e.target.value)}
          />

          <p>Password Strength: {strength}</p>

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have account?
          <span onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

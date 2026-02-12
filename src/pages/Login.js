import React, { useState } from "react";
import "./Auth.css";
import api from "../api";



export default function Login({ onSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);


  /* ---------- LOGIN API ---------- */
 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !pass.trim()) {
    setError("Please enter email & password");
    return;
  }

  try {
    const res = await api.post("/users/login", {
      email,
      password: pass,
    });

    console.log("LOGIN RESPONSE:", res.data);

    // Save user locally
    localStorage.setItem("lg_user", JSON.stringify(res.data.user));
    localStorage.setItem("lg_auth", "true");

    setError("");

    if (onSuccess) onSuccess();
  } catch (err) {
    setError(
      err.response?.data?.message || "❌ Invalid email or password"
    );
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>
        <p className="sub">Login to continue</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        <div style={{ position: "relative" }}>
  <input
    type={showPass ? "text" : "password"}
    placeholder="Password"
    value={pass}
    onChange={(e) => setPass(e.target.value)}
    required
    style={{ width: "100%", paddingRight: 40 }}
  />

  <span
    onClick={() => setShowPass(!showPass)}
    style={{
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: 18,
    }}
  >
    {showPass ? "🙈" : "👁"}
  </span>
</div>

          <button className="btn-primary" type="submit">
            Login
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={switchToSignup}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}
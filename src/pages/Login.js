import React, { useState, useEffect } from "react";
import "./Auth.css";
import api from "../api";

export default function Login({ onSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", {
        email,
        password: pass,
      });

      localStorage.setItem("lg_user", JSON.stringify(res.data.user));
      localStorage.setItem("lg_token", res.data.token);
      localStorage.setItem("lg_auth", "true");

      onSuccess();
    } catch (err) {
      setError("Invalid login");
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "770031219524-2q6noqjlpma47sve6b5i7p141hua5fpu.apps.googleusercontent.com",
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogle = async (response) => {
    const res = await api.post("/users/google-login", {
      token: response.credential,
    });

    localStorage.setItem("lg_user", JSON.stringify(res.data.user));
    localStorage.setItem("lg_token", res.data.token);
    localStorage.setItem("lg_auth", "true");

    onSuccess();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <div id="googleBtn" style={{ marginTop: 20 }}></div>

        <p>
          No account? <span onClick={switchToSignup}>Signup</span>
        </p>
      </div>
    </div>
  );
}

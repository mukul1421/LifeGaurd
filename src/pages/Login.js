import React, { useState } from "react";
import "./Auth.css";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";


export default function Login({ onSuccess, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !pass.trim()) {
    setError("Please enter email & password");
    return;
  }

  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);

    const user = {
      uid: res.user.uid,
      email: res.user.email,
      name: res.user.displayName || "",
      photo: res.user.photoURL || "",
      provider: "password",
    };

    localStorage.setItem("lg_user", JSON.stringify(user));
    localStorage.setItem("lg_auth", "true");

    setError("");
    onSuccess(); // ✅ SAME AS BEFORE
  } catch (err) {
    setError("❌ Invalid email or password");
  }
};
const handleGoogleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);

    const user = {
      uid: res.user.uid,
      email: res.user.email,
      name: res.user.displayName,
      photo: res.user.photoURL,
      provider: "google",
    };

    localStorage.setItem("lg_user", JSON.stringify(user));
    localStorage.setItem("lg_auth", "true");

    onSuccess(); // ✅ SAME FLOW
  } catch (err) {
    setError("Google login failed");
    console.error(err);
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

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="button" className="btn-primary" style={{ background: "#4285F4", marginTop: 10 }} onClick={handleGoogleLogin}>
            🔐 Login in with Google
          </button>
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

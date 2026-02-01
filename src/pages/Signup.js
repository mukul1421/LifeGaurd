import React, { useState } from "react";
import "./Auth.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";



export default function Signup({ onSuccess, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");

  /* ---------- PASSWORD STRENGTH CHECK ---------- */
  const checkStrength = (value) => {
    setPass(value);

    let strengthScore = 0;

    if (value.length >= 6) strengthScore++;
    if (/[A-Z]/.test(value)) strengthScore++;
    if (/[0-9]/.test(value)) strengthScore++;
    if (/[^A-Za-z0-9]/.test(value)) strengthScore++;

    if (strengthScore === 0) setStrength("");
    else if (strengthScore <= 1) setStrength("Weak");
    else if (strengthScore === 2) setStrength("Medium");
    else setStrength("Strong");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !pass.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (strength === "Weak" || strength === "") {
      setError("Password is too weak. Please make it stronger.");
      return;
    }

    try {
  const res = await createUserWithEmailAndPassword(auth, email, pass);

  // ✅ Set display name
  await updateProfile(res.user, {
    displayName: username,
  });

  const user = {
    uid: res.user.uid,
    name: username,
    email: res.user.email,
    provider: "password",
  };

  localStorage.setItem("lg_user", JSON.stringify(user));
  localStorage.setItem("lg_auth", "true");

  setError("");
  if (onSuccess) onSuccess();
} catch (err) {
  setError(err.message);
}


    if (onSuccess) onSuccess();
  };
  const handleGoogleSignup = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);

    const user = {
      uid: res.user.uid,
      name: res.user.displayName || "",
      email: res.user.email,
      photo: res.user.photoURL || "",
      provider: "google",
    };

    localStorage.setItem("lg_user", JSON.stringify(user));
    localStorage.setItem("lg_auth", "true");

    setError("");
    if (onSuccess) onSuccess(); // ✅ SAME FLOW
  } catch (err) {
    setError("Google signup failed");
    console.error(err);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account 🎉</h1>
        <p className="sub">Join LifeGuard</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            value={pass}
            onChange={(e) => checkStrength(e.target.value)}
            required
          />

          {/* ---------- PASSWORD STRENGTH UI ---------- */}
          {pass && (
            <p
              style={{
                marginTop: "-5px",
                marginBottom: "10px",
                fontWeight: "bold",
                color:
                  strength === "Weak"
                    ? "red"
                    : strength === "Medium"
                    ? "orange"
                    : "green",
              }}
            >
              Password Strength: {strength}
            </p>
          )}

          <button className="btn-primary" type="submit">
            Create Account
          </button>
          <button type="button" className="btn-primary" style={{ background: "#4285F4", marginTop: 10 }} onClick={handleGoogleSignup} >
            🔐 Sign up with Google
          </button>

        </form>

        <p className="switch-text">
          Already have an account?
          <span onClick={switchToLogin}> Login</span>
        </p>
      </div>
    </div>
  );
}
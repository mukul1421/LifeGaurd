import React, { useState } from "react";
import "./Auth.css";
import api from "../api";


export default function Signup({ onSuccess, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");
  const [showPass, setShowPass] = useState(false);


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

  /* ---------- SIGNUP API CALL ---------- */
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
    const res = await api.post("/users/signup", {
      name: username,
      email,
      password: pass,
    });

    // Save user locally
    localStorage.setItem("lg_user", JSON.stringify(res.data.user));
    localStorage.setItem("lg_auth", "true");

    setError("");

    if (onSuccess) onSuccess();
  } catch (err) {
    setError(
      err.response?.data?.message || "Signup failed. Try again."
    );
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
        </form>

        <p className="switch-text">
          Already have an account?
          <span onClick={switchToLogin}> Login</span>
        </p>
      </div>
    </div>
  );
}
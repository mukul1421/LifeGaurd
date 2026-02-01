import React, { useState, createContext, useEffect } from "react";
// import { Routes, Route, useNavigate, NavLink, useLocation } from "react-router-dom";
import { Routes, Route, useNavigate, NavLink, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";



// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import QuickCheck from "./pages/QuickCheck";
import Community from "./pages/Community";
import Reminders from "./pages/Reminders";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import HealthTips from "./pages/HealthTips";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./pages/dark-theme.css";

// Navbar
import Navbar from "./components/Navbar";

export const strings = {
  en: {
    dashboardTitle: "Your Health Dashboard",
    sidebarDashboard: "Dashboard",
    sidebarQuick: "Quick Check",
    sidebarCommunity: "Community",
    sidebarReminders: "Reminders",
    sidebarWallet: "Medical Wallet",
    sidebarSettings: "Settings",
    footer: "Prototype — LifeGuard • PotatoCoders",
  },

  hi: {
    dashboardTitle: "आपका स्वास्थ्य डैशबोर्ड",
    sidebarDashboard: "डैशबोर्ड",
    sidebarQuick: "तुरंत जांच",
    sidebarCommunity: "समुदाय",
    sidebarReminders: "रिमाइंडर",
    sidebarWallet: "मेडिकल वॉलेट",
    sidebarSettings: "सेटिंग्स",
    footer: "प्रोटोटाइप — लाइफगार्ड • पोटैटोकोडर्स",
  },
};

export const LangContext = createContext({ lang: "en", setLang: () => {} });

export default function App() {

  const [lang, setLang] = useState(localStorage.getItem("lg_lang") || "en");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lg_lang", lang);
  }, [lang]);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("lg_settings") || "{}");
    if (settings.darkMode)
      document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }, []);

    // 🔥 Firebase test (ADD ONLY – does not affect app)
  useEffect(() => {
    const testFirebase = async () => {
      try {
        await addDoc(collection(db, "system_logs"), {
          app: "LifeGuard",
          message: "Firebase connected successfully",
          time: new Date(),
        });
        console.log("✅ Firebase Firestore connected");
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    };

    testFirebase();
  }, []);


  const handleLoginSuccess = () => navigate("/app");
  const switchToSignup = () => navigate("/auth/signup");
  const switchToLogin = () => navigate("/auth/login");

  const hideNavbar =
  location.pathname === "/" ||
  location.pathname.startsWith("/app") ||
  location.pathname.startsWith("/auth");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
  path="/auth/login"
  element={
    <Login
      onSuccess={handleLoginSuccess}
      switchToSignup={switchToSignup}
    />
  }
/>

<Route
  path="/auth/signup"
  element={
    <Signup
      onSuccess={switchToLogin}   // ✅ IMPORTANT
      switchToLogin={switchToLogin}
    />
  }
/>


        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </LangContext.Provider>
  );
}

/* ================= MAIN APP LAYOUT ================= */
function MainApp() {
    
  const { lang } = React.useContext(LangContext);
  const navigate = useNavigate();

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("lg_user");

    Object.keys(localStorage).forEach((k) => {
      if (
        k.startsWith("lg_progress_") ||
        k.startsWith("lg_wallet_last_upload_") ||
        k.startsWith("lg_reminders_") ||
        k.startsWith("lg_quickcheck_") ||
        k.startsWith("lg_community_")
      ) {
        localStorage.removeItem(k);
      }
    });

    window.location.href = "/";
  };

  return (
    <div className="app">
      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div
  className="brand"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/")}
>
  <div className="logo">LG</div>
  <div>
    <div style={{ fontWeight: 800 }}>LifeGuard</div>
    <div className="small">AI Health Companion</div>
  </div>
</div>


        <nav className="menu">
          <NavLink to="/app" end>
            <div className="icon">🏠</div> {strings[lang].sidebarDashboard}
          </NavLink>

          <NavLink to="/app/quick">
            <div className="icon">🔎</div> {strings[lang].sidebarQuick}
          </NavLink>

          <NavLink to="/app/community">
            <div className="icon">💬</div> {strings[lang].sidebarCommunity}
          </NavLink>

          <NavLink to="/app/reminders">
            <div className="icon">⏰</div> {strings[lang].sidebarReminders}
          </NavLink>

          <NavLink to="/app/wallet">
            <div className="icon">📁</div> {strings[lang].sidebarWallet}
          </NavLink>

          <NavLink to="/app/settings">
            <div className="icon">⚙</div> {strings[lang].sidebarSettings}
          </NavLink>
        </nav>

        {/* ✅ LOGOUT BUTTON AT BOTTOM */}
        <button
          onClick={handleLogout}
          className="btn"
          style={{
            background: "#ef4444",
            width: "100%",
            marginTop: "20px",
            color: "white",
            fontWeight: 700,
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          🚪 Logout
        </button>

        <div style={{ marginTop: 20 }} className="small">
          Built for rural India • Offline ready • English/Hindi
        </div>
      </aside>

      {/* ---------- Main Content ---------- */}
      <main className="content">
        <div className="topbar card">
          <div style={{ fontWeight: 800 }}>
            {strings[lang].dashboardTitle}
          </div>
          <ShortSettings />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quick" element={<QuickCheck />} />
          <Route path="/community" element={<Community />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/healthtips" element={<HealthTips />} />
        </Routes>

        <div className="footer">{strings[lang].footer}</div>
      </main>
    </div>
  );
}

/* ================= LANGUAGE SWITCH ================= */
function ShortSettings() {
  const { lang, setLang } = React.useContext(LangContext);

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{ padding: 8, borderRadius: 8 }}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}
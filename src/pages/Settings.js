import React, { useState, useContext, useEffect } from "react";
import { LangContext } from "../App";
import Swal from "sweetalert2";
import api from "../api";


export default function Settings() {
  const { lang, setLang } = useContext(LangContext);

  /* ================= LANGUAGE TEXT ================= */
  const t = {
    en: {
      title: "Settings Panel",
      hello: "Hello",
      subtitle: "Personalize your Lifeguard experience 💚",

      profile: "Profile",
      name: "Name",
      gender: "Gender",
      avatar: "Avatar",

      personalization: "Personalization",
      darkMode: "Dark Mode",
      // accent: "Accent Theme",
      language: "Language",

      notificationsTitle: "Notifications",
      medRem: "Medicine Reminders",
      tips: "Health Tips",
      checkup: "Checkup Alerts",
      enableSys: "Enable System Notifications",

      privacy: "Privacy & Data",
      ai: "Allow AI Health Predictions",
      backup: "Download My Health Data",
      restore: "Restore Backup",
      clear: "Clear All Data",

      saveAll: "Save All Settings",

      swalSaveTitle: "Settings Applied",
      swalSaveMsg: "Your app is now personalized!",
      reset: "Reset Done",
      resetMsg: "Default settings applied",
      clearWarn: "Clear All Data?",
      clearMsg: "You will lose all saved records!",
      yesClear: "Yes, clear",
      cleared: "Cleared",
    },

    hi: {
      title: "सेटिंग्स पैनल",
      hello: "नमस्ते",
      subtitle: "अपना लाइफगार्ड अनुभव पर्सनलाइज़ करें 💚",

      profile: "प्रोफ़ाइल",
      name: "नाम",
      gender: "लिंग",
      avatar: "अवतार",

      personalization: "पर्सनलाइज़ेशन",
      darkMode: "डार्क मोड",
      accent: "थीम रंग",
      language: "भाषा",

      notificationsTitle: "सूचनाएं",
      medRem: "दवाई रिमाइंडर",
      tips: "स्वास्थ्य टिप्स",
      checkup: "हेल्थ चेकअप अलर्ट",
      enableSys: "सिस्टम नोटिफिकेशन ऑन करें",

      privacy: "प्राइवेसी और डेटा",
      ai: "एआई हेल्थ प्रेडिक्शन की अनुमति",
      backup: "मेरा स्वास्थ्य डेटा डाउनलोड करें",
      restore: "बैकअप बहाल करें",
      clear: "सारा डेटा हटाएं",

      saveAll: "सभी सेटिंग्स सहेजें",

      swalSaveTitle: "सेटिंग्स लागू",
      swalSaveMsg: "आपका ऐप अब पर्सनलाइज़ हो गया है!",
      reset: "रीसेट पूरा",
      resetMsg: "डिफ़ॉल्ट सेटिंग लागू हो गई",
      clearWarn: "सारा डेटा हटाएं?",
      clearMsg: "आपका सेव किया डेटा चला जाएगा!",
      yesClear: "हां, हटाएं",
      cleared: "डेटा हटा दिया गया",
    },
  };

 const savedUser = JSON.parse(localStorage.getItem("lg_user") || "{}");
const userId = savedUser?._id;
const USER_KEY = savedUser?.email || "guest";
const SETTINGS_KEY = `lg_settings_${USER_KEY}`;

const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");



  const [darkMode, setDarkMode] = useState(savedSettings.darkMode || false);
  // const [accent, setAccent] = useState(savedSettings.accent || "#14b8a6");
  const [name, setName] = useState(savedUser.name || "User");
  const [gender, setGender] = useState(savedSettings.gender || "Female");
  const [avatar, setAvatar] = useState(savedSettings.avatar || "🙂");
  const [aiConsent, setAiConsent] = useState(savedSettings.aiConsent ?? true);
  const [notifications, setNotifications] = useState(
    
    savedSettings.notifications || {
      medicine: true,
      tips: true,
      checkup: true,
    }
  );
  /* ⭐ LOAD SETTINGS FROM BACKEND */
useEffect(() => {
  const loadSettings = async () => {
    try {
      const res = await api.get("/settings");

      if (!res.data) return;

      const s = res.data;

      if (s.name) setName(s.name);
      if (s.gender) setGender(s.gender);
      if (s.avatar) setAvatar(s.avatar);
      if (typeof s.darkMode === "boolean") setDarkMode(s.darkMode);
      if (s.notifications) setNotifications(s.notifications);
      if (typeof s.aiConsent === "boolean") setAiConsent(s.aiConsent);

    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  loadSettings();
}, []);


  /* DARK MODE LOAD */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");


    if (saved.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      setDarkMode(true);
    } else {
      document.documentElement.removeAttribute("data-theme");
      setDarkMode(false);
    }
  }, []);

  /* APPLY DARK MODE */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");

    const updated = { ...saved, darkMode };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));


    if (darkMode) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }, [darkMode]);

  // /* ACCENT */
  // useEffect(() => {
  //   document.documentElement.style.setProperty("--accent", accent);
  // }, [accent]);

  /* SAVE SETTINGS */
const save = async () => {
  try {
    await api.post("/settings/save", {
      name,
      gender,
      avatar,
      darkMode,
      notifications,
      aiConsent,
    });

    const updatedUser = { ...savedUser, name };
    localStorage.setItem("lg_user", JSON.stringify(updatedUser));

    // ⭐ ADD THIS BLOCK HERE
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        name,
        gender,
        avatar,
        darkMode,
        notifications,
        aiConsent,
      })
    );

    Swal.fire("Saved!", "Settings stored", "success");
  } catch (err) {

    console.error(err);
    Swal.fire("Error saving settings", "", "error");
  }
};


  /* CLEAR DATA */
  const clearAll = () => {
    Swal.fire({
      title: `⚠ ${t[lang].clearWarn}`,
      text: t[lang].clearMsg,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t[lang].yesClear,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        Swal.fire(t[lang].cleared, "", "success").then(() =>
          window.location.reload()
        );
      }
    });
  };

  /* NOTIFICATION PERMISSION */
  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") Swal.fire("Enabled!", "", "success");
      else Swal.fire("Denied", "", "warning");
    }
  };

  return (
  <div className="settings-root">
    <div style={{ padding: 25 }}>
      <h2 style={{ textAlign: "center" }}>⚙ {t[lang].title}</h2>


      {/* HEADER */}
      <Glass dark={darkMode}>
        <h3>
          {avatar} {t[lang].hello}, {name}!
        </h3>
        <p>{t[lang].subtitle}</p>
      </Glass>

      {/* PROFILE */}
      <Glass dark={darkMode}>
        <h3>👤 {t[lang].profile}</h3>

        <InputRow label={t[lang].name}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </InputRow>

        <InputRow label={t[lang].gender}>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </InputRow>

        <InputRow label={t[lang].avatar}>
          <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option>🙂</option>
            <option>👩</option>
            <option>👨</option>
            <option>🧕</option>
          </select>
        </InputRow>
      </Glass>

      {/* THEME */}
      <Glass dark={darkMode}>
        <h3>🎨 {t[lang].personalization}</h3>

        <Toggle label={t[lang].darkMode} checked={darkMode} onChange={setDarkMode} />

        {/* <InputRow label={t[lang].accent}>
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
        </InputRow> */}

        <InputRow label={t[lang].language}>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </InputRow>
      </Glass>

      {/* NOTIFICATIONS */}
      <Glass dark={darkMode}>
        <h3>🔔 {t[lang].notificationsTitle}</h3>

        <Toggle
          label={t[lang].medRem}
          checked={notifications.medicine}
          onChange={(v) => setNotifications({ ...notifications, medicine: v })}
        />

        <Toggle
          label={t[lang].tips}
          checked={notifications.tips}
          onChange={(v) => setNotifications({ ...notifications, tips: v })}
        />

        <Toggle
          label={t[lang].checkup}
          checked={notifications.checkup}
          onChange={(v) => setNotifications({ ...notifications, checkup: v })}
        />

        <button className="btn" onClick={enableNotifications}>
          🔔 {t[lang].enableSys}
        </button>
      </Glass>

      {/* PRIVACY */}
      <Glass dark={darkMode}>
        <h3>🛡 {t[lang].privacy}</h3>

        <Toggle
          label={t[lang].ai}
          checked={aiConsent}
          onChange={setAiConsent}
        />

        <button className="btn">{t[lang].backup}</button>
        <button className="btn">{t[lang].restore}</button>

        <button style={dangerBtn} onClick={clearAll}>
          🗑 {t[lang].clear}
        </button>
      </Glass>

      <button style={saveBtn} onClick={save}>
        💾 {t[lang].saveAll}
      </button>
    </div>
    </div>
  );
}

/* UI HELPERS */
const Glass = ({ children, dark }) => (
  <div
    style={{
      background: dark
        ? "linear-gradient(145deg,#102c55,#0d223f)"
        : "rgba(255,255,255,.9)",
      color: dark ? "white" : "black",
      borderRadius: 16,
      padding: 18,
      marginBottom: 18,
      border: dark ? "1px solid rgba(180,220,255,0.18)" : "none",
    }}
  >
    {children}
  </div>
);

const InputRow = ({ label, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
    <label>{label}</label>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
  </div>
);

const dangerBtn = {
  background: "#ef4444",
  color: "white",
  borderRadius: 8,
  padding: "8px 16px",
  border: "none",
  marginTop: 8,
};

const saveBtn = {
  background: "linear-gradient(90deg,#14b8a6,#0ea5e9)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontWeight: 600,
  display: "block",
  margin: "10px auto",
};
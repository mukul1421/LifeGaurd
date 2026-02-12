import React, { useState, useEffect } from "react";
import api from "../api";

import { useContext } from "react";
import { LangContext } from "../App";


export default function MedicalWallet() {
  // ⭐ Get Logged In User
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userKey = user?.uid || user?.email || "guest";
  const API = "/medical-wallet";


  // ⭐ Use USER SPECIFIC STORAGE
  const STORAGE_KEY = `lg_medical_records_${userKey}`;
  const LAST_UPLOAD_KEY = `lg_wallet_last_upload_${userKey}`;

  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileNotes, setFileNotes] = useState("");
  const [file, setFile] = useState(null);
 const { lang } = useContext(LangContext);


  const t = {
    en: {
      title: "Digital Medical Wallet",
      subtitle:
        "Store prescriptions, lab reports, x-rays securely in one place.",
      addRecord: "Add New Record",
      recordName: "Record / Hospital Name",
      recordType: "Type (Prescription, Report, Scan…)",
      notes: "Notes or doctor details (optional)",
      upload: "Choose File",
      save: "Save Record",
      myRecords: "My Records",
      noRecords: "No records yet. Start adding 👆",
      addedOn: "Added on",
      attached: "Attached File",
      viewPDF: "View PDF",
      delete: "Delete",
      alertAdd: "Record saved securely ✅",
      alertName: "Please enter record name!",
      alertDelete: "Delete this record?",
    },
    hi: {
      title: "डिजिटल मेडिकल वॉलेट",
      subtitle: "अपनी रिपोर्ट, पर्ची और स्कैन सुरक्षित रखें।",
      addRecord: "नया रिकॉर्ड जोड़ें",
      recordName: "रिकॉर्ड / अस्पताल का नाम",
      recordType: "प्रकार (पर्ची, रिपोर्ट, स्कैन…)",
      notes: "नोट्स / डॉक्टर विवरण (वैकल्पिक)",
      upload: "फ़ाइल चुनें",
      save: "रिकॉर्ड सहेजें",
      myRecords: "मेरे रिकॉर्ड",
      noRecords: "अभी तक कोई रिकॉर्ड नहीं ✨",
      addedOn: "जोड़ा गया",
      attached: "संलग्न फ़ाइल",
      viewPDF: "PDF देखें",
      delete: "हटाएं",
      alertAdd: "रिकॉर्ड सुरक्षित रूप से जोड़ दिया गया ✅",
      alertName: "कृपया रिकॉर्ड का नाम लिखें!",
      alertDelete: "रिकॉर्ड हटाना चाहते हैं?",
    },
  };

  /* ================= BACKEND FETCH ================= */

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`${API}/${user._id}`);


      if (res.data.length > 0) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOCAL SAVE ================= */

  const saveRecords = (updated) => {
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (updated.length > 0) {
      const last = {
        name: updated[0].name,
        date: new Date().toISOString(),
      };
      localStorage.setItem(LAST_UPLOAD_KEY, JSON.stringify(last));
    }
  };

  /* ================= ADD RECORD ================= */

  const addRecord = async () => {
    if (!fileName.trim()) return alert(t[lang].alertName);

    const reader = new FileReader();
    const newRecord = {
      id: Date.now(),
      name: fileName,
      type: fileType || "Document",
      notes: fileNotes,
      date: new Date().toLocaleDateString(),
    };

    if (file) {
      reader.onload = async () => {
        newRecord.fileData = reader.result;
        newRecord.fileName = file.name;

        saveRecords([newRecord, ...records]);

        /* ⭐ BACKEND SAVE */
       await api.post(API, {

         userId: "000000000000000000000000",
          documentName: fileName,
          documentType: fileType || "Document",
          fileUrl: file.name,
        });

        resetForm();
        alert(t[lang].alertAdd);
      };
      reader.readAsDataURL(file);
    } else {
      saveRecords([newRecord, ...records]);

      /* ⭐ BACKEND SAVE */
    await api.post(API, {

       userId: user._id,

        documentName: fileName,
        documentType: fileType || "Document",
        fileUrl: "",
      });

      resetForm();
      alert(t[lang].alertAdd);
    }
  };

  /* ================= DELETE ================= */
const deleteRecord = async (id) => {
  if (!window.confirm(t[lang].alertDelete)) return;

  try {
    // ⭐ If MongoDB record
    if (id.length === 24) {
      await api.delete(`${API}/${id}`);

      fetchRecords();
    } 
    // ⭐ If Local record
    else {
      saveRecords(records.filter((r) => r.id !== id));
    }
  } catch (err) {
    console.error(err);
  }
};


  const resetForm = () => {
    setFileName("");
    setFileType("");
    setFileNotes("");
    setFile(null);
  };

  useEffect(() => {
    document.title = t[lang].title;
  }, [lang]);

  return (
    <div className="card" style={{ padding: 25 }}>
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        
      </div>

      <h2>💼 {t[lang].title}</h2>
      <p className="muted">{t[lang].subtitle}</p>

      <div className="card">
        <h3>{t[lang].addRecord}</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            type="text"
            value={fileName}
            placeholder={t[lang].recordName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <input
            type="text"
            value={fileType}
            placeholder={t[lang].recordType}
            onChange={(e) => setFileType(e.target.value)}
          />

          <textarea
            rows={3}
            value={fileNotes}
            placeholder={t[lang].notes}
            onChange={(e) => setFileNotes(e.target.value)}
          />

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn" onClick={addRecord}>
            💾 {t[lang].save}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>📁 {t[lang].myRecords}</h3>

        {records.length === 0 ? (
          <p className="muted">{t[lang].noRecords}</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {records.map((r) => (
              <div className="card" key={r._id || r.id}>
                <h4>
                  🗂 {r.name} <span className="small">({r.type})</span>
                </h4>

                {r.notes && <p>🩺 {r.notes}</p>}

                <p className="small">
                  📅 {t[lang].addedOn}: {r.date}
                </p>

                {(r.fileData || r.fileUrl) && (
                  <>
                    <p>
                      📎 <b>{t[lang].attached}:</b> {r.fileName}
                    </p>

                    {(r.fileData || r.fileUrl).includes("pdf") ? (
                      <a
                        href={r.fileData || r.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn"
                      >
                        📄 {t[lang].viewPDF}
                      </a>
                    ) : (
                      <img
                        src={r.fileData || r.fileUrl}
                        alt={r.fileName}
                        style={{
                          maxWidth: "100%",
                          borderRadius: 10,
                          marginTop: 8,
                        }}
                      />
                    )}
                  </>
                )}

                <button
                  className="btn"
                  style={{ background: "#ef4444" }}
                  onClick={() => deleteRecord(r._id || r.id)}
                >
                  🗑 {t[lang].delete}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
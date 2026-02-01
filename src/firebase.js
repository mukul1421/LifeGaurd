// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRbzDUpnPqmKIQSuOXWzv0G6jCb81FwKs",
  authDomain: "buildforbharat2026.firebaseapp.com",
  projectId: "buildforbharat2026",
  storageBucket: "buildforbharat2026.firebasestorage.app",
  messagingSenderId: "550012304895",
  appId: "1:550012304895:web:9667f1bcc8552f57ffbbca",
  measurementId: "G-BVQ8F7SMPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();



import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // 🔥 NEW IMPORT

// REPLACE THIS OBJECT WITH YOUR ACTUAL KEYS FROM FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBwnWvwDBiYXGJt5rewbZlGmCP4gch5cNw",
  authDomain: "resume-e577b.firebaseapp.com",
  projectId: "resume-e577b",
  storageBucket: "resume-e577b.firebasestorage.app",
  messagingSenderId: "652718045008",
  appId: "1:652718045008:web:462fefb9e990774e749e55",
  measurementId: "G-19YDNQ7T3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // 🔥 NEW EXPORT
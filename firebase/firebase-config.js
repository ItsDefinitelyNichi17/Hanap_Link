
// Browser-side Firebase initialization (uses Firebase's CDN "modular" SDK).
// This is the ONE Firebase app instance the whole frontend uses —
// firebaseDB.js imports `db` from here. (app.js is unused/legacy — it was
// written for Node and reads process.env, which doesn't exist in a browser,
// so it will not work if loaded on a page. You can delete it.)
//
// TODO before this works: replace the REPLACE_WITH_* placeholders below with
// the real values from Firebase Console > Project settings > General >
// Your apps > SDK setup and configuration (project: "hanaplink").
// These values are safe to commit/ship in frontend code — Firebase Web
// apiKey/appId/etc. are not secret; real access control is enforced by your
// Firestore Security Rules, not by hiding this config.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_0fRKo0gNItZTDuJGoROmV49qSYNQMQk",
  authDomain: "hanaplink.firebaseapp.com",
  databaseURL: "https://hanaplink-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hanaplink",
  storageBucket: "hanaplink.firebasestorage.app",
  messagingSenderId: "681680410265",
  appId: "1:681680410265:web:5e333d877f8404d0780a08",
  measurementId: "G-5W11QV7L3G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export default app;
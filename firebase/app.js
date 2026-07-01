import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

/* import path from 'path';
import dotenv from 'dotenv'

const envpath = path.join(import.meta.dirname, "..", ".env");
dotenv.config({path : envpath}) */

/* const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "hanaplink.firebaseapp.com",
  databaseURL: process.env.DB_URL,
  projectId: "hanaplink",
  storageBucket: "hanaplink.firebasestorage.app",
  messagingSenderId: process.env.MESS_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEAS_ID
}; */

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
//console.log(app)
export default app;
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import path from 'path';
import dotenv from 'dotenv'

const envpath = path.join(import.meta.dirname, "..", ".env");
dotenv.config({path : envpath})

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "hanaplink.firebaseapp.com",
  databaseURL: process.env.DB_URL,
  projectId: "hanaplink",
  storageBucket: "hanaplink.firebasestorage.app",
  messagingSenderId: process.env.MESS_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEAS_ID
};

const app = initializeApp(firebaseConfig);
//console.log(app)
export default app;
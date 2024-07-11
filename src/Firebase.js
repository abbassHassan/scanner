// src/Firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzSLD1C8d4jAuzOmCdeB9ZHI0HgviBY3g",
  authDomain: "scanner-kb816f.firebaseapp.com",
  projectId: "scanner-kb816f",
  storageBucket: "scanner-kb816f.appspot.com",
  messagingSenderId: "202007813558",
  appId: "1:202007813558:web:355df7fb4eaf8254bbb517",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

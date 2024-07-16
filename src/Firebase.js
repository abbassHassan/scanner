// src/Firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKkrjPzyS4-P2RMUHjjPAEw7bfrQ32i5M",
  authDomain: "scannerr-k6ayp6.firebaseapp.com",
  projectId: "scannerr-k6ayp6",
  storageBucket: "scannerr-k6ayp6.appspot.com",
  messagingSenderId: "263648883687",
  appId: "1:263648883687:web:73ad4389bfbc087d5c0342",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

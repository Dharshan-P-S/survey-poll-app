import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCIy0x8hLWh5er0lm4BksEEQxQblgAPKZA",
  authDomain: "surver-poll-app.firebaseapp.com",
  projectId: "surver-poll-app",
  storageBucket: "surver-poll-app.firebasestorage.app",
  messagingSenderId: "199121180534",
  appId: "1:199121180534:web:c2be303b9ac0bc969fcc57",
  measurementId: "G-5X384PHJMW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

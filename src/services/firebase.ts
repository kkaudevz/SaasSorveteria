// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuApVgl3LXqVH9PEExd42d_2a7jP0N0m8",
  authDomain: "bdsorveteria-e831a.firebaseapp.com",
  projectId: "bdsorveteria-e831a",
  storageBucket: "bdsorveteria-e831a.firebasestorage.app",
  messagingSenderId: "845847038219",
  appId: "1:845847038219:web:fceb91fb0c43676e1efa0e",
  measurementId: "G-WWE4K6MEWB",
};

// Inicializa app Firebase
const app = initializeApp(firebaseConfig);

// Instancia Firestore
const db = getFirestore(app);

export { db };

// // Firebase configuration
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAjdPdmFc3-fXD5Vp3mLm6O6WjtWPmks-4",
//   authDomain: "task-f8e91.firebaseapp.com",
//   projectId: "task-f8e91",
//   storageBucket: "task-f8e91.firebasestorage.app",
//   messagingSenderId: "430934345104",
//   appId: "1:430934345104:web:1d31af777ee4db0ddb9f15",
//   measurementId: "G-4MCLWER19Z"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// export const db = getFirestore(app);
// export default app;

// src/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// If you later need Auth/Storage/Analytics, import their getters here.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Prevent re-initializing in dev HMR
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);
export default app;


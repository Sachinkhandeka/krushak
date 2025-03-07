// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "krushak-a5239.firebaseapp.com",
  projectId: "krushak-a5239",
  storageBucket: "krushak-a5239.firebasestorage.app",
  messagingSenderId: "237609659107",
  appId: "1:237609659107:web:519be06b99202af67473d6",
  measurementId: "G-FN0VRHN2LQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


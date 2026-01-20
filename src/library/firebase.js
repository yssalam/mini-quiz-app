// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdEBiPg-GH7BlN6-op3bq-dIVGyBgtNI0",
  authDomain: "quiz-mini-23cfc.firebaseapp.com",
  projectId: "quiz-mini-23cfc",
  storageBucket: "quiz-mini-23cfc.firebasestorage.app",
  messagingSenderId: "1065409047184",
  appId: "1:1065409047184:web:b5c9cfc1b9029bca410615",
  measurementId: "G-TGX2C11PB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
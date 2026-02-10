// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth  ,GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgiJEtHjbmr3fRcoGA4GK0-U7F-4weVi8",
  authDomain: "cloudvapors.firebaseapp.com",
  projectId: "cloudvapors",
  storageBucket: "cloudvapors.firebasestorage.app",
  messagingSenderId: "828004949569",
  appId: "1:828004949569:web:e18155f17e2a7774e330c0",
  measurementId: "G-FJTPYF8C6G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
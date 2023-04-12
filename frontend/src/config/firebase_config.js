// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZumAc4LirvtOvUT8RALtBYdiBEiorE4k",
  authDomain: "recollections-381610.firebaseapp.com",
  projectId: "recollections-381610",
  storageBucket: "recollections-381610.appspot.com",
  messagingSenderId: "18229699408",
  appId: "1:18229699408:web:4de1e90f5c029429714255",
  measurementId: "G-EQR35TPRQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
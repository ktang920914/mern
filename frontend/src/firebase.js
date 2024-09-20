// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-cae70.firebaseapp.com",
  projectId: "mern-cae70",
  storageBucket: "mern-cae70.appspot.com",
  messagingSenderId: "497658920886",
  appId: "1:497658920886:web:7a806526ec15ed0a008b17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
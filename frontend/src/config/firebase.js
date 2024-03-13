// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-f2a19.firebaseapp.com",
  projectId: "realestate-f2a19",
  storageBucket: "realestate-f2a19.appspot.com",
  messagingSenderId: "880901887066",
  appId: "1:880901887066:web:9db46cb2e9ce8f568c3463"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
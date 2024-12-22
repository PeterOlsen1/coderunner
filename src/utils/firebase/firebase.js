// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVrthPI2W-M54fDabP5nbADcvf72JpusA",
  authDomain: "coderunner-b83a5.firebaseapp.com",
  projectId: "coderunner-b83a5",
  storageBucket: "coderunner-b83a5.firebasestorage.app",
  messagingSenderId: "707293332948",
  appId: "1:707293332948:web:d03fa4195bc79364828241",
  measurementId: "G-RM2B193FWF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

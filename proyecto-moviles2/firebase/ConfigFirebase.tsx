// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV4_wJLYCVp5RIRy0E4M0-0u1-2dbWrpQ",
    authDomain: "app-07-1c5a6.firebaseapp.com",
    databaseURL: "https://app-07-1c5a6-default-rtdb.firebaseio.com",
    projectId: "app-07-1c5a6",
    storageBucket: "app-07-1c5a6.firebasestorage.app",
    messagingSenderId: "436963023100",
    appId: "1:436963023100:web:06807cde09c7ee64b1df79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
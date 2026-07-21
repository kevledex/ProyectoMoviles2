// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJqpcu05LJw7FwFD9isU4flErGchCJDBg",
    authDomain: "app-07-25043.firebaseapp.com",
    databaseURL: "https://app-07-25043-default-rtdb.firebaseio.com",
    projectId: "app-07-25043",
    storageBucket: "app-07-25043.firebasestorage.app",
    messagingSenderId: "826757339208",
    appId: "1:826757339208:web:0bda0d36e5da396ab2207d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
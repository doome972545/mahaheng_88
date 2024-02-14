// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDG040A0ewuwOTP6g0TwyquEAzjHmRi9Sg",
    authDomain: "test-c6007.firebaseapp.com",
    databaseURL: "https://test-c6007-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-c6007",
    storageBucket: "test-c6007.appspot.com",
    messagingSenderId: "141368098053",
    appId: "1:141368098053:web:1af35fd4a8c8da57c34b6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
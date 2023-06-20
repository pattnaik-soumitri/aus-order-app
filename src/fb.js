// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbq9QugYhv1muMYPtbu7luHV_AMTLak1Q",
  authDomain: "aus-order-form.firebaseapp.com",
  projectId: "aus-order-form",
  storageBucket: "aus-order-form.appspot.com",
  messagingSenderId: "943914175430",
  appId: "1:943914175430:web:bd256bf86aa0279fca80c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firestore
const db = getFirestore(app);

export {db}
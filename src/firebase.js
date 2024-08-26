// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref as dbRef, set, get, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2sikiw2_wYZ0jE5v62dj021Gu33b78eM",
  authDomain: "new-e-learning-edecs.firebaseapp.com",
  projectId: "new-e-learning-edecs",
  storageBucket: "new-e-learning-edecs.appspot.com",
  messagingSenderId: "82033132236",
  appId: "1:82033132236:web:30aa4a6ef16e8251077869",
  measurementId: "G-CEZJRLPSW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage, dbRef, set, get, onValue, createUserWithEmailAndPassword, signInWithEmailAndPassword, storageRef, uploadBytes, getDownloadURL };


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcuMebW6SIHAyOwAl7Nhf_jGWAESQ5Fyo",
  authDomain: "taskmanager-4c5a2.firebaseapp.com",
  projectId: "taskmanager-4c5a2",
  storageBucket: "taskmanager-4c5a2.appspot.com",
  messagingSenderId: "660765435623",
  appId: "1:660765435623:web:ebc2e0b606da422be2e442",
  measurementId: "G-N68KKM5VTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

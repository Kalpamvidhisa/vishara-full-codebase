import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDIeGTZn7KA4CHeVXAyG1fiYnJ-45GDXuY",
    authDomain: "vishara-d96f4.firebaseapp.com",
    projectId: "vishara-d96f4",
    storageBucket: "vishara-d96f4.appspot.com",
    messagingSenderId: "809109421705",
    appId: "1:809109421705:web:a5e052859f90d8cdc49058",
    measurementId: "G-LYTZXZ6KN8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log("Fetching documents from Firebase Firestore...");
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    console.log(`\n=== USERS COLLECTION (${usersSnapshot.size} records found) ===`);
    usersSnapshot.forEach((doc) => {
      console.log(`UID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("-----------------------------------------");
    });

    const logsSnapshot = await getDocs(collection(db, "login_history"));
    console.log(`\n=== LOGIN HISTORY COLLECTION (${logsSnapshot.size} records found) ===`);
    logsSnapshot.forEach((doc) => {
      console.log(`Log ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("-----------------------------------------");
    });
  } catch (error) {
    console.error("Error reading Firestore database:", error);
  }
}

check();

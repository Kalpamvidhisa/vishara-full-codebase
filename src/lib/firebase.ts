import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCbsl3vkWt4DMcAnAkAdye4LhljSG5fovg",
    authDomain: "vishara-health-connect.firebaseapp.com",
    projectId: "vishara-health-connect",
    storageBucket: "vishara-health-connect.firebasestorage.app",
    messagingSenderId: "572703828576",
    appId: "1:572703828576:web:39bccccfe1b51d235ab105",
    measurementId: "G-D7B5SJYTP7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics =
    typeof window !== "undefined"
        ? getAnalytics(app)
        : null;

export default app;
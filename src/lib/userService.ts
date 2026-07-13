import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function saveUser(user: any) {
    await setDoc(
        doc(db, "users", user.uid),
        {
            uid: user.uid,
            phone: user.phoneNumber,
            createdAt: new Date(),
        },
        { merge: true }
    );
}
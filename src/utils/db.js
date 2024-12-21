import {
    getFirestore,
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { app } from './firebase';
import { ensureAuth } from './auth';

let db = getFirestore(app);
let usersRef = collection(db, 'users');
let passagesRef = collection(db, 'passages');


export async function addNewUser(userId) {
    const docRef = doc(usersRef, userId);
    return await setDoc(docRef, {});
}

export async function addLanguage(language) {
    const docRef = doc(passagesRef, language);
    return await setDoc(docRef, {nextId: 1});
}

/**working on this guy ATM */
export async function addPassage(language, passage) {
    const docRef = doc(passagesRef, language);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        await addLanguage(language);
    }
    const nextId = docSnap.data().nextId;
    const languageRef = collection(passagesRef, language);
}
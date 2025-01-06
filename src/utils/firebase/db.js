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
import { ensureAuth, user } from './auth';

let db = getFirestore(app);
let usersRef = collection(db, 'users');
let passagesRef = collection(db, 'passages');
let approvalRef = collection(db, 'approval')


export class LanguageNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}

export class PassageNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}

export class NotLoggedInError extends Error {
    constructor(message) {
        super(message);
    }
}


/**
 * Add a new user to the database.
 * Called on every login.
 * 
 * @param {string} userId 
 */
export async function addNewUser(userId) {
    const docRef = doc(usersRef, userId);

    //add user if they don't exist
    if (!(await getDoc(docRef)).exists()) {
        await setDoc(docRef, {dateJoined: Timestamp.now()});
    }
}


/**
 * Add a language to the passages collection
 * @param {string} language 
 */
export async function addLanguage(language) {
    const docRef = doc(passagesRef, language);
    await setDoc(docRef, {nextId: 1});
}


/**
 * Add a language to the approval collection
 * 
 * @param {string} language 
 */
async function addApprovalLanguage(language) {
    const docRef = doc(approvalRef, language);
    await setDoc(docRef, {});
}


/**
 * Get a list of all languages in the 'passages' collection
 * @returns ^
 */
export async function getAllLanguages() {
    const querySnapshot = await getDocs(passagesRef);
    let languages = [];
    querySnapshot.forEach((doc) => {
        let obj = {
            language: doc.id,
            url: doc.data().url,
            unapproved: doc.data().unapproved
        }
        languages.push(obj);
    });

    return languages;
}


/**
 * Get a given passage
 * 
 * @param {string} language 
 * @param {number} id 
 * @returns 
 */
export async function getPassage(language, id) {
    const docRef = doc(passagesRef, language, 'passages', id.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    else {
        throw new PassageNotFoundError("Passage not found!");
    }
}


/**
 * Get a random passage from a given langauge
 * 
 * @param {string} language 
 * @returns A random passage
 */
export async function getRandomPassage(language) {
    const languagePassagesRef = collection(passagesRef, language, 'passages');
    const docSnap = await getDocs(languagePassagesRef);
    let out = [];
    docSnap.forEach((doc) => {
        out.push(doc.data());
    });

    return out[Math.floor(Math.random() * out.length)];
}


/**
 * Let only moderators actually upload passages. Everyone else should get approved.
 * 
 * @returns 
 */
export async function uploadForApproval(language, difficulty, passage, source) {
    try {
        if (!user) {
            throw new NotLoggedInError("User not logged in!");
        }

        // get the language collection reference
        let languageRef = doc(approvalRef, language);
        let docSnap = await getDoc(languageRef);
        if (!docSnap.exists()) {
            await addApprovalLanguage(language);
            languageRef = doc(approvalRef, language);
            docSnap = await getDoc(languageRef);
        }
        

        //get the actual language collection we can get the ID from
        //if it doesn't exist, create it and flag is as unapproved
        let approvedLanguageRef = doc(passagesRef, language);
        let approvedDocSnap = await getDoc(approvedLanguageRef);

        let unapprovedFlag = false;
        if (!approvedDocSnap.exists()) {
            await addLanguage(language);
            approvedLanguageRef = doc(passagesRef, language);
            approvedDocSnap = await getDoc(languageRef);
            unapprovedFlag = true
        }
        let approvedData = approvedDocSnap.data();
        let nextId = approvedData.nextId;

        //make sure ID exists
        if (!nextId) {
            nextId = 1;
        }

        if (unapprovedFlag) {
            approvedData.unapproved = true;
        }

        approvedData.nextId = nextId + 1;
        console.log(approvedData);
        await setDoc(approvedLanguageRef, approvedData);

        //insert the passage into the unapproved collection
        const lines = passage.split('\n').length;    
        const passageRef = doc(languageRef, 'passages', nextId.toString());
        await setDoc(passageRef, {
            difficulty,
            lines,
            passage,
            language,
            source: source || "",
            id: nextId,
            created: Timestamp.now(),
            uploadedBy: user.uid
        });

        //update the user's pending uploads
        const userRef = doc(usersRef, user.uid);
        const docSnapUser = await getDoc(userRef);
        let data = await docSnapUser.data();
        const pendingUploads = data.pendingUploads || {};
        pendingUploads[language] = pendingUploads[language] || [];
        pendingUploads[language].push(nextId);
        data.pendingUploads = pendingUploads;
        await setDoc(userRef, data);

        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export async function approvePassage(language, id) {
    try {
        if (!user) {
            throw new Error("User not logged in!");
        }

        //get the language collection that needs approval
        let languageRef = doc(approvalRef, language);
        let docSnap = await getDoc(languageRef);
        if (!docSnap.exists()) {
            throw new Error("Language does not exist!");
        }
        

        let data = docSnap.data();
        if (data.unapproved) {
            data.unapproved = false;
            await setDoc(languageRef, data);
        }

        let userPassageRef = doc(languageRef, 'passages', id.toString());
        let passageSnap = await getDoc(userPassageRef);
        if (!passageSnap.exists()) {
            throw new PassageNotFoundError("Passage does not exist!");
        }

        //mark the language as approved
        let languageDataRef = doc(passagesRef, language);
        let languageData = (await getDoc(languageDataRef)).data();
        languageData.unapproved = false;

        //move data from pending to approved
        let passageData = passageSnap.data();
        const uploader = passageData.uploadedBy;
        await setDoc(doc(passagesRef, language), languageData);
        await setDoc(doc(passagesRef, language, 'passages', id.toString()), passageData);
        await deleteDoc(userPassageRef);

        //remove from pending uploads
        const userRef = doc(usersRef, uploader);
        const docSnapUser = await getDoc(userRef);
        data = await docSnapUser.data();
        data.pendingUploads[language] = data.pendingUploads[language].filter((x) => x !== id);

        //insert into uploaded passages
        const uploadedPassages = data.uploadedPassages || {};
        uploadedPassages[language] = uploadedPassages[language] || [];
        uploadedPassages[language].push(id);
        data.uploadedPassages = uploadedPassages;
        await setDoc(userRef, data);

        await setDoc(userRef, data);

        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export async function denyPassage(language, id) {
    try {
        if (!user) {
            throw new Error("User not logged in!");
        }

        //get the language collection that needs approval
        let languageRef = doc(approvalRef, language);
        let docSnap = await getDoc(languageRef);
        if (!docSnap.exists()) {
            throw new Error("Language does not exist!");
        }

        let userPassageRef = doc(languageRef, 'passages', id.toString());
        let passageSnap = await getDoc(userPassageRef);
        if (!passageSnap.exists()) {
            throw new PassageNotFoundError("Passage does not exist!");
        }

        //remove from pending uploads
        let data = passageSnap.data();
        const uploader = data.uploadedBy;
        const userRef = doc(usersRef, uploader);
        const docSnapUser = await getDoc(userRef);
        data = await docSnapUser.data();
        data.pendingUploads[language] = data.pendingUploads[language].filter((x) => x !== id);
        await setDoc(userRef, data);

        await deleteDoc(userPassageRef);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export async function getAllUnapprovedPassages() {
    let out = {};

    const querySnapshot = await getDocs(approvalRef);
    for (let doc of querySnapshot.docs) {
        let passages = await getDocs(collection(doc.ref, 'passages'));
        for (let passage of passages.docs) {
            let data = passage.data();
            out[data.language] = out[data.language] || [];
            out[data.language].push(data);
        }
    }

    return out;
}

/** make functions for deleting approved / unapproved passages as well */

// ================== USER FUNCTIONS ==================

export async function uploadPassageStats(passageData, lang, passageId) {
    try {
        if (!user) {
            throw new NotLoggedInError("User not logged in!");
        }

        //fetch overall user
        const userRef = doc(usersRef, user.uid);
        const docSnap = await getDoc(userRef);
        let data = docSnap.data();

        let correct = 0;
        let incorrect = 0;
        for (let key of passageData.keystrokes) {
            if (key.correct) {
                correct++;
            }
            else {
                incorrect++;
            }
        }

        //add totals to overall user data
        data.correct = data.correct ? data.correct + correct : correct;
        data.incorrect = data.incorrect ? data.incorrect + incorrect : incorrect;
        data.time = data.time ? data.time + passageData.time : passageData.time;

        //1* for easy, 2* for medium, 3* for hard
        let xp = correct * (passageData.difficulty == 'easy' ? 1 : passageData.difficulty == 'medium' ? 2 : 3);
        data.xp = data.xp ? data.xp + xp : xp;

        const typedPassageRef = doc(userRef, 'passages', lang, passageId.toString());
        const passageSnap = await getDoc(typedPassageRef);
        const dbPassageData = passageSnap.data();

        if (dbPassageData.attempts) {
            dbPassageData.attempts.push(passageData);
        }
        else {
            dbPassageData.attempts = [passageData];
        }

        await setDoc(passageSnap, dbPassageData);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
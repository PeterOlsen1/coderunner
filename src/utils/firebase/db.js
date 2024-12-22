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

export async function addNewUser(userId) {
    const docRef = doc(usersRef, userId);

    //add user if they don't exist
    if (!(await getDoc(docRef)).exists()) {
        await setDoc(docRef, {dateJoined: Timestamp.now()});
    }
}

export async function addLanguage(language) {
    const docRef = doc(passagesRef, language);
    return await setDoc(docRef, {nextId: 1});
}

async function addApprovalLanguage(language) {
    const docRef = doc(approvalRef, language);
    return await setDoc(docRef, {});
}

export async function getAllLanguages() {
    const querySnapshot = await getDocs(passagesRef);
    let languages = [];
    querySnapshot.forEach((doc) => {
        languages.push(doc.id);
    });

    return languages;
}

/**
 * 
 * @param {string} language 
 * @param {string} difficulty 
 * @param {string} passage 
 * @param {string} source Source URL for the code
 * @returns 
 */
export async function addPassage(language, difficulty, passage, source) {
    try {
        if (!user) {
            return false;
        }

        let languageRef = doc(passagesRef, language);
        let docSnap = await getDoc(languageRef);
        if (!docSnap.exists()) {
            await addLanguage(language);
            languageRef = doc(passagesRef, language);
            docSnap = await getDoc(languageRef);
        }
        
        let data = docSnap.data();
        let nextId = data.nextId;
        data.nextId++;
        await updateDoc(languageRef, data);
    
        if (!nextId) {
            nextId = 1;
        }

        const lines = passage.split('\n').length;
        // let languages = await getAllLanguages();
        // if (!languages.includes(language)) {
        //     throw new LanguageNotFoundError("Language does not exist!");
        // }
    
        const passageRef = doc(languageRef, 'passages', nextId.toString());
        await setDoc(passageRef, {
            difficulty,
            lines,
            passage,
            source: source || "",
            id: nextId,
            created: Timestamp.now(),
            uploadedBy: user.uid
        });

        // const userRef = doc(usersRef, user.uid);
        // const docSnapUser = await getDoc(userRef);
        // data = await docSnapUser.data();
        // const uploadedPassages = data.uploadedPassages || {};
        // uploadedPassages[language] = uploadedPassages[language] || [];
        // uploadedPassages[language].push(nextId);
        // data.uploadedPassages = uploadedPassages;
        // await setDoc(userRef, data);

        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Let only moderators actually upload passages. Everyone else should get approved.
 * 
 * @returns 
 */
export async function uploadForApproval(language, difficulty, passage, source) {
    try {
        if (!user) {
            return false;
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

        //move data from pending to approved
        let passageData = passageSnap.data();
        const uploader = passageData.uploadedBy;
        await setDoc(doc(passagesRef, language), languageData);
        await setDoc(doc(passagesRef, language, 'passages', id.toString()), passageData);
        await deleteDoc(userPassageRef);

        //mark the language as approved
        let languageDataRef = doc(passagesRef, language);
        let languageData = (await getDoc(languageDataRef)).data();
        languagesData.unapproved = false;

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
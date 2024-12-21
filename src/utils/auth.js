import { GithubAuthProvider } from "firebase/auth/web-extension";
import { app } from "./firebase";
import { GoogleAuthProvider, getAuth, signInAnonymously, signInWithPopup } from 'firebase/auth';

let auth = getAuth(app);
export let user = auth.currentUser;

export async function ensureAuth() {
    await auth.authStateReady();
    user = auth.currentUser;
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await ensureAuth();
    window.location = '/home';
}

export async function signInWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
    await ensureAuth();
    window.location = '/home';
}

export async function signInAnon() {
    await signInAnonymously(auth);
    await ensureAuth();
    window.location = '/home';
}
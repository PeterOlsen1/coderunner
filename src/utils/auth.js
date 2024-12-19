import { GithubAuthProvider } from "firebase/auth/web-extension";
import { app } from "./firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

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
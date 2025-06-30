// firebase/auth.ts
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";
import { app } from "./config";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------
   SAFELY expose `auth`
   – On the server  ➜ it’s just  undefined (no window access → no crash)
   – In the browser ➜ it’s the real Auth instance                 */
export const auth: Auth | undefined = app ? getAuth(app) : undefined;

// Provider can be created even on the server (doesn’t touch window)
const provider = new GoogleAuthProvider();

/* -------- helper wrappers that assert we’re on the client -------- */
export const signInWithGoogle = async () => {
  if (!auth) 
  {
    toast.error('Unable to Login!');
    throw new Error("signInWithGoogle was called on the server");
  }
  const { user } = await signInWithPopup(auth, provider);
  toast.success('Logged in succesfully!');
  return user;
};

export const logOut = async () => {
  if (!auth) 
  {
    toast.error('Unable to Logout!');
    throw new Error("logOut was called on the server");
  }
  await signOut(auth);
  toast.success('Logged out succesfully!');
};

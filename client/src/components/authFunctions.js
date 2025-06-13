// authFunctions.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // authentication

// Sign up function
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign in function 
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

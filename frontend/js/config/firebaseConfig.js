import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC10g3OzmTGCByEDY-1dANavrtwSQCrty8",
    authDomain: "lumind-auth.firebaseapp.com",
    projectId: "lumind-auth",
    storageBucket: "lumind-auth.firebasestorage.app",
    messagingSenderId: "168250450787",
    appId: "1:168250450787:web:5d6f21c8573d958a86a956",
    measurementId: "G-8S1L5B02DK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup }; // 👈 exporta a função

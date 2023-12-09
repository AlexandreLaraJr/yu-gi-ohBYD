import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyDePe6Pu5fX5si_Msk8CP-AeUb2al6XGIk",
    authDomain: "yugioh-tcg-deckbuilder-654eb.firebaseapp.com",
    projectId: "yugioh-tcg-deckbuilder-654eb",
});

export const db = getFirestore(firebaseConfig);

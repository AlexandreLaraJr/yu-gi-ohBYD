import { ReactNode, createContext, useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../services/firestore";

type DecksContextType = {
    // Define the shape of your context data here
};
const db: any = getFirestore(firebaseConfig);
export const DecksContext = createContext<DecksContextType | {}>({});

type DecksContextProviderProps = {
    children: ReactNode;
    value: DecksContextType;
};

// const firebaseApp = initializeApp({
//     apiKey: "AIzaSyDePe6Pu5fX5si_Msk8CP-AeUb2al6XGIk",
//     authDomain: "yugioh-tcg-deckbuilder-654eb.firebaseapp.com",
//     projectId: "yugioh-tcg-deckbuilder-654eb",
// });

export function DecksContextProvider({
    children,
    value,
}: DecksContextProviderProps) {
    const [_cards, setCards] = useState<any>(() => {
        //puxa os decks que ja estao salvos
        //if(!Variavel-que-pega-os-decks) return []
    });
    // const db = getFirestore(firebaseApp);
    const decksCollectionReference = collection(db, "decks");

    // const createNewDeck = async () => {
    //     const deck = await addDoc(decksCollectionReference, {
    //         // deckName
    //         // mainDeck
    //         // extraDeck
    //     });
    // };

    useEffect(() => {
        const getDecks = async () => {
            const data = await getDocs(decksCollectionReference);
            setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getDecks();
    }, []);

    // const value = {decks e addDecks};

    return (
        <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
    );
}

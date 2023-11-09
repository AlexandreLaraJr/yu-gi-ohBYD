import { ReactNode, createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, addDoc } from "firebase/firestore";

type DecksContextType = {
    // Define the shape of your context data here
};

export const DecksContext = createContext<DecksContextType | {}>({});

type DecksContextProviderProps = {
    children: ReactNode;
    value: DecksContextType;
};

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDePe6Pu5fX5si_Msk8CP-AeUb2al6XGIk",
    authDomain: "yugioh-tcg-deckbuilder-654eb.firebaseapp.com",
    projectId: "yugioh-tcg-deckbuilder-654eb",
});

export function DecksContextProvider({
    children,
    value,
}: DecksContextProviderProps) {
    const [cards, setCards] = useState(() => {
        //puxa os decks que ja estao salvos
        //if(!Variavel-que-pega-os-decks) return []
    });
    const database = getFirestore(firebaseApp);
    const decksCollectionReference = collection(database, "decks");

    const insertCard = async () => {
        const deck = await addDoc(decksCollectionReference, {
            //cardName
            //cardId
            //cardArchetype
        });
    };

    useEffect(() => {
        const getDecks = async () => {
            const data = await getDocs(decksCollectionReference);
            console.log(
                data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        };
        getDecks();
    }, []);

    // const value = {decks e addDecks};

    return (
        <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
    );
}

import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../services/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

const db: any = getFirestore(firebaseConfig);

export default function ListDecks() {
    const [data, setData] = useState<any>([]);
    const [deckRemoved, setDeckRemoved] = useState<boolean>(false);

    const currentUser = getAuth().currentUser?.uid;
    const [decksSelected, setDecksSelected] = useState(currentUser);

    // const fetchData = async () => {
    //     const querySnapshot = await getDocs(collection(db, decksSelected));
    //     const newData = querySnapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         id: doc.id,
    //     }));
    //     setData(newData);
    // };

    const fetchData = async () => {
        if (decksSelected) {
            const querySnapshot = await getDocs(collection(db, decksSelected));
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setData(newData);
        } else {
            console.error("Você nao está logado!");
        }
    };

    useEffect(() => {
        fetchData();
    }, [deckRemoved]);

    useEffect(() => {
        fetchData();
    }, [decksSelected]);
    // let fullDeck: any[] = [];
    // if (data && Array.isArray(data.mainDeck) && Array.isArray(data.extraDeck)) {
    //     fullDeck = data.mainDeck.concat(data.extraDeck);
    // }

    // const db = firebase.firestore()

    const removeDeck = async (deckName: string, _index: number) => {
        try {
            await deleteDoc(doc(db, "decks", deckName));
            setDeckRemoved((prev) => !prev);
            console.log("Deck excluido com sucesso");
        } catch (error: any) {
            console.error(`Erro ao excluir o deck: ${error}`);
        }
    };

    return (
        <>
            <div className="flex flex-row gap-2">
                <button
                    className="bg-violet-700"
                    onClick={() => setDecksSelected(currentUser)}
                >
                    Meus Decks
                </button>
                <button
                    className="bg-violet-700"
                    onClick={() => setDecksSelected("public")}
                >
                    Decks publicos
                </button>
            </div>
            <div className="flex flex-row ">
                {data.length === 0 ? (
                    <h2 className="text-2xl">
                        {currentUser !== undefined
                            ? "Você não possui nenhum deck salvo!"
                            : "Ainda não existe nenhum deck publico!"}
                    </h2>
                ) : (
                    data.map((showDeck: any, index: any) => {
                        return (
                            <div className="border-2 " key={index}>
                                <h2 className="text-2xl">
                                    {showDeck.deckName}
                                </h2>
                                <button
                                    onClick={() => {
                                        removeDeck(showDeck.deckName, index);
                                    }}
                                    className="p-1 h-10 w-10 mt-52 text-center text-white bg-red-500 border-2 border-red-900 absolute justify-center "
                                >
                                    X
                                </button>
                                <img
                                    src={showDeck.mainDeck[0].image_url_small}
                                    alt=""
                                />
                                <p>
                                    Deck price: U$
                                    {(
                                        data[index].mainDeckTotalPrice +
                                        data[index].extraDeckTotalPrice
                                    ).toFixed(2)}
                                </p>
                            </div>
                        );
                    })
                )}

                {/* <BuildedDecks /> */}
            </div>
        </>
    );
}

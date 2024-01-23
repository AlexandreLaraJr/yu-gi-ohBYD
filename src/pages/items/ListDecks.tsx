import BuildedDecks from "../../components/BuildedDecks";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../services/firestore";
import { useState, useEffect } from "react";

export default function ListDecks() {
    const [data, setData] = useState<any>([]);
    const [deckRemoved, setDeckRemoved] = useState<boolean>(false);

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "decks"));
        const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setData(newData);
        console.log(newData);
    };

    useEffect(() => {
        fetchData();
    }, [deckRemoved]);

    // let fullDeck: any[] = [];
    // if (data && Array.isArray(data.mainDeck) && Array.isArray(data.extraDeck)) {
    //     fullDeck = data.mainDeck.concat(data.extraDeck);
    // }

    // const db = firebase.firestore()

    const removeDeck = async (deckName: string, index: number) => {
        try {
            await deleteDoc(doc(db, "decks", deckName));
            setDeckRemoved((prev) => !prev);
            console.log("Deck excluido com sucesso");
        } catch (error: any) {
            console.error(`Erro ao excluir o deck: ${error}`);
        }
    };

    return (
        <div className="flex flex-row ">
            {data.length === 0 ? (
                <h2 className="text-2xl">Você não possui nenhum deck salvo!</h2>
            ) : (
                data.map((showDeck: any, index: any) => {
                    return (
                        <div className="border-2 " key={index}>
                            <h2 className="text-2xl">{showDeck.deckName}</h2>
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
    );
}

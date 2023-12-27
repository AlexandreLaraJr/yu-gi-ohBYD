import BuildedDecks from "../../components/BuildedDecks";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firestore";
import { useState, useEffect } from "react";

export default function ListDecks() {
    const [data, setData] = useState<any>([]);

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
    }, []);

    // let fullDeck: any[] = [];
    // if (data && Array.isArray(data.mainDeck) && Array.isArray(data.extraDeck)) {
    //     fullDeck = data.mainDeck.concat(data.extraDeck);
    // }

    return (
        <>
            {data.map((showDeck: any, index: any) => {
                return (
                    <div className="border-2" key={index}>
                        <h2 className="text-2xl">{showDeck.deckName}</h2>
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
            })}
            <h2>Mostrando todos decks</h2>
            <BuildedDecks />
        </>
    );
}

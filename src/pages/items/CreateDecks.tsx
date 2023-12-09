import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    updateDoc,
    Firestore,
    doc,
    setDoc,
} from "firebase/firestore";
import { db } from "../../services/firestore";

type CardDescription = {
    card_prices: any;
    image_url_small: string | undefined;
    map: any;
    id: number;
    name: string;
    desc: string;
    frameType: string;
    card_sets: Array<{
        set_name: string;
        set_code: string;
        set_rarity: string;
        set_rarity_code: string;
        set_price: string;
    }>;
    card_images: Array<{
        id: number;
        image_url: string;
        image_url_small: string;
        image_url_cropped: string;
    }>;
};

export default function CreateDecks() {
    const [card, setCard] = useState<CardDescription>();
    const [searchCard, setSearchCard] = useState("");
    const [deckName, setDeckName] = useState("");

    let [cardsMainDeck, setCardsMainDeck] = useState<CardDescription[]>([]);
    let [cardsExtraDeck, setCardsExtraDeck] = useState<CardDescription[]>([]);

    const addData = async () => {
        const docRef = doc(db, "decks", deckName);

        await setDoc(
            docRef,
            {
                mainDeck: [...cardsMainDeck],
                extraDeck: [...cardsExtraDeck],
                deckName: deckName,
            },
            { merge: true }
        );
    };

    useEffect(() => {}, [cardsMainDeck]);

    const showCards = () => {
        if (searchCard !== "") {
            fetch(
                `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${searchCard}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setCard(data.data);
                });
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        showCards();
    };

    const handleInputChange = (event: any) => {
        event.preventDefault();
        setSearchCard(event.target.value);
    };

    const handleSubmitToDataBase = (event: any) => {
        event.preventDefault();
        addData();
    };

    const handleInputDeckName = (event: any) => {
        event.preventDefault();
        setDeckName(event.target.value);
    };

    const checkExtraDeck = (cardToCheck: any) => {
        if (
            cardToCheck.frameType === "synchro" ||
            cardToCheck.frameType === "xyz" ||
            cardToCheck.frameType === "link" ||
            cardToCheck.frameType === "fusion"
        ) {
            return true;
        } else {
            return false;
        }
    };

    const checkCardQuantity = (cardToCheck: any) => {
        const cardsToCheck = checkExtraDeck(cardToCheck)
            ? cardsExtraDeck
            : cardsMainDeck;

        const filteredArray = cardsToCheck.filter(
            (card) => card.id === cardToCheck.id
        );

        return filteredArray.length < 3;
    };

    const handleAddToDeck = (card: any) => {
        const cardToAdd = {
            id: card.id,
            name: card.name,
            desc: card.desc,
            image_url_small: card.card_images[0].image_url_small,
            frameType: card.frameType,
        };

        if (checkExtraDeck(card)) {
            if (cardsExtraDeck.length < 15 && checkCardQuantity(card)) {
                setCardsExtraDeck((prevCards: any) => [
                    ...prevCards,
                    cardToAdd,
                ]);
            }
        } else if (cardsMainDeck.length < 60 && checkCardQuantity(card)) {
            setCardsMainDeck((prevCards: any) => [...prevCards, cardToAdd]);
        } else {
            alert("carta nao adicionada");
        }
    };

    const removeCard = (deck: CardDescription[], index: any) => {
        const updatedDeck = deck.filter((_, i) => i !== index);
        if (checkExtraDeck(deck[index])) {
            setCardsExtraDeck(updatedDeck);
        } else {
            setCardsMainDeck(updatedDeck);
        }
    };

    return (
        <>
            <form className="font-black" onSubmit={handleSubmitToDataBase}>
                <input
                    className="font-black bg-slate-600"
                    type="text"
                    placeholder="Deck Name"
                    onChange={handleInputDeckName}
                />
                <button type="submit">Submit</button>
            </form>
            <div className=" grid phone:grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-5 desktopxl:grid-cols-7  relative my-auto">
                {cardsMainDeck.map(
                    (cardsToShow: CardDescription, index: number) => {
                        return (
                            <div
                                className="border-2 p-2 flex flex-row"
                                key={index}
                            >
                                <img
                                    className="static "
                                    src={cardsToShow.image_url_small}
                                    alt={cardsToShow.name}
                                />

                                <button
                                    onClick={() =>
                                        removeCard(cardsMainDeck, index)
                                    }
                                    className="p-1 h-10 w-10 text-center text-white bg-red-500 absolute mt-52 ml-36"
                                >
                                    X
                                </button>
                            </div>
                        );
                    }
                )}
            </div>
            <div className="grid phone:grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-5 desktopxl:grid-cols-7  relative my-auto">
                {cardsExtraDeck.map(
                    (cardsToShow: CardDescription, index: number) => {
                        return (
                            <div
                                className="border-2 p-2 flex flex-row"
                                key={index}
                            >
                                <img
                                    className="static "
                                    src={cardsToShow.image_url_small}
                                    alt={cardsToShow.name}
                                />
                                <button
                                    onClick={() =>
                                        removeCard(cardsExtraDeck, index)
                                    }
                                    className="p-1 h-10 w-10 text-center text-white bg-red-500 absolute mt-52 ml-32"
                                >
                                    X
                                </button>
                            </div>
                        );
                    }
                )}
            </div>
            <form className="font-black" onSubmit={handleSubmit}>
                <input
                    className="font-black bg-slate-600"
                    type="text"
                    placeholder="Card Name"
                    onChange={handleInputChange}
                />
                <button type="submit">Search</button>
            </form>
            <div className="flex flex-wrap flex-row items-center justify-center gap-8 my-16 w-full">
                {card &&
                    card.map((cardReturned: CardDescription, index: number) => {
                        return (
                            //aqui
                            <div
                                className="border-2 p-2 flex flex-row"
                                key={index}
                            >
                                <img
                                    className="w-auto h-72"
                                    src={`https://images.ygoprodeck.com/images/cards/${cardReturned.id}.jpg`}
                                    alt={cardReturned.name}
                                />
                                <div className="flex flex-col w-auto h-72">
                                    <div className="w-full flex flex-col">
                                        <h2 className="font-extrabold text-end">
                                            {cardReturned.name}
                                        </h2>
                                        <p className="p-2 text-justify overflow-auto w-96 h-32">
                                            {cardReturned.desc}
                                        </p>
                                        <p className="font-extrabold text-end mt-4">
                                            Price: U$
                                            {
                                                cardReturned.card_prices[0]
                                                    .tcgplayer_price
                                            }
                                        </p>
                                    </div>
                                    <button
                                        className="mt-10 self-end"
                                        onClick={() => {
                                            handleAddToDeck(cardReturned);
                                        }}
                                    >
                                        Add to my deck
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
function docRef(
    db: Firestore,
    arg1: string
): import("@firebase/firestore").DocumentReference<
    unknown,
    {
        mainDeck: CardDescription[];
        extraDeck: CardDescription[];
        deckName: string;
    }
> {
    throw new Error("Function not implemented.");
}

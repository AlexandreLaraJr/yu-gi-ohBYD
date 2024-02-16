import { useEffect, useState } from "react";
// import { Firestore, doc, setDoc, getFirestore } from "firebase/firestore";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../services/firestore";
import { getAuth } from "firebase/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    let [priceCardMainDeck, setPriceCardMainDeck] = useState<any>(0);
    let [priceCardExtraDeck, setPriceCardExtraDeck] = useState<any>(0);
    let [cardsMainDeck, setCardsMainDeck] = useState<CardDescription[]>([]);
    let [cardsExtraDeck, setCardsExtraDeck] = useState<CardDescription[]>([]);

    const db: any = getFirestore(firebaseConfig);

    const currentUserUID = getAuth().currentUser?.uid;

    const addData = async () => {
        const docRef = doc(db, currentUserUID, deckName);

        await setDoc(
            docRef,
            {
                mainDeck: [...cardsMainDeck],
                extraDeck: [...cardsExtraDeck],
                deckName: deckName,
                mainDeckTotalPrice: priceCardMainDeck,
                extraDeckTotalPrice: priceCardExtraDeck,
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
        setPriceCardExtraDeck(Number(priceCardExtraDeck.toFixed(2)));
        setPriceCardMainDeck(Number(priceCardMainDeck.toFixed(2)));

        if (currentUserUID === undefined) {
            checkLoginToast();
            return;
        }

        if (!checkMinimunCardQuantity()) {
            needCardAddedToast();
            return;
        }
        if (deckName === "") {
            deckNameMissingToast();
            return;
        }
        deckCreatedToast();
        addData();
    };

    const checkMinimunCardQuantity = () => {
        if (cardsMainDeck.length === 0) {
            return false;
        }
        return true;
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

        if (filteredArray.length < 3) {
            return true;
        } else {
            threeCardsToast();
        }
    };

    const handleAddToDeck = (card: any) => {
        const cardToAdd = {
            id: card.id,
            name: card.name,
            archetype: card.archetype,
            desc: card.desc,
            image_url_small: card.card_images[0].image_url_small,
            frameType: card.frameType,
            card_price: card.card_prices[0].tcgplayer_price,
        };

        // if (checkExtraDeck(card)) {
        //     if (cardsExtraDeck.length < 15 && checkCardQuantity(card)) {
        //         setCardsExtraDeck((prevCards: any) => [
        //             ...prevCards,
        //             cardToAdd,
        //         ]);
        //         let cardPrice = Number(cardToAdd.card_price);
        //         setPriceCardExtraDeck(priceCardExtraDeck + cardPrice);
        //     }
        // } else if (cardsMainDeck.length < 60 && checkCardQuantity(card)) {
        //     setCardsMainDeck((prevCards: any) => [...prevCards, cardToAdd]);
        //     let cardPrice = Number(cardToAdd.card_price);
        //     setPriceCardMainDeck(priceCardMainDeck + cardPrice);
        // } else {
        //     fullMainDeckToast();
        // }

        if (checkCardQuantity(card)) {
            if (checkExtraDeck(card)) {
                if (cardsExtraDeck.length < 15) {
                    setCardsExtraDeck((prevCards: any) => [
                        ...prevCards,
                        cardToAdd,
                    ]);
                    setPriceCardExtraDeck(
                        (prevPrice: number) =>
                            prevPrice + Number(cardToAdd.card_price)
                    );
                } else {
                    fullExtraDeckToast();
                }
                return;
            } else {
                if (cardsMainDeck.length < 60) {
                    setCardsMainDeck((prevCards: any) => [
                        ...prevCards,
                        cardToAdd,
                    ]);
                    setPriceCardMainDeck(
                        (prevPrice: number) =>
                            prevPrice + Number(cardToAdd.card_price)
                    );
                } else {
                    fullMainDeckToast();
                }
            }
        }
    };

    const removeCard = (deck: any, index: any) => {
        const updatedDeck = deck.filter((_: any, i: any) => i !== index);
        const cardPrice = Number(deck[index].card_price);
        if (checkExtraDeck(deck[index])) {
            setCardsExtraDeck(updatedDeck);
            setPriceCardExtraDeck(priceCardExtraDeck - cardPrice);
        } else {
            setCardsMainDeck(updatedDeck);
            setPriceCardMainDeck(priceCardMainDeck - cardPrice);
        }
    };

    const threeCardsToast: any = () => {
        toast.warn("Você só pode colocar 3 cartas repetidas!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const fullMainDeckToast: any = () => {
        toast.warn("Você atingiu o limite de 60 cartas no deck principal!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const fullExtraDeckToast: any = () => {
        toast.warn("Você atingiu o limite de 15 cartas no deck extra!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const checkLoginToast: any = () => {
        toast.warn("Você precisa ter efetuado o login!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const needCardAddedToast: any = () => {
        toast.warn("Você precisa adicionar cartas para enviar!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };
    const deckCreatedToast: any = () => {
        toast.success("Deck criado!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };
    const deckNameMissingToast: any = () => {
        toast.warn("Você precisa definir o nome do deck!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    return (
        <>
            <ToastContainer />
            <form
                className="font-white font-bold flex gap-2 my-4"
                onSubmit={handleSubmitToDataBase}
            >
                <input
                    className="rounded-md placeholder-slate-300 font-white bg-slate-900"
                    type="text"
                    placeholder="Deck Name"
                    onChange={handleInputDeckName}
                />
                <button
                    className="bg-purple-500 hover:bg-purple-600 "
                    type="submit"
                >
                    Submit
                </button>
            </form>

            <div
                className={`relative grid gap-0 phone:grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-5 desktopxl:grid-cols-7 my-auto
                 w-full h-auto mb-4 ${
                     cardsMainDeck.length > 0
                         ? "border-purple-900 bg-indigo-950 border-2"
                         : ""
                 }`}
            >
                <h2
                    className={`${
                        cardsMainDeck.length > 0
                            ? "absolute text-base right-0 -m-6 border-2 rounded-md p-1 bg-violet-700 mr-52"
                            : ""
                    }`}
                >
                    {`${
                        cardsMainDeck.length > 0
                            ? `Total de cartas: ${cardsMainDeck.length}`
                            : ""
                    }
        `}
                </h2>
                <h2
                    className={`${
                        priceCardMainDeck > 0
                            ? "absolute text-base right-0 -m-6 border-2 rounded-md p-1 bg-violet-700"
                            : ""
                    }`}
                >
                    {`${
                        priceCardMainDeck > 0
                            ? `Valor do main deck: U$ ${priceCardMainDeck.toFixed(
                                  2
                              )}`
                            : ""
                    }
                    `}
                </h2>
                {cardsMainDeck.map(
                    (cardsToShow: CardDescription, index: number) => {
                        return (
                            <div className=" p-2 flex flex-row" key={index}>
                                <img
                                    className="static"
                                    src={cardsToShow.image_url_small}
                                    alt={cardsToShow.name}
                                />

                                <button
                                    onClick={() => {
                                        removeCard(cardsMainDeck, index);
                                    }}
                                    className="p-1 h-10 w-10 mt-52 text-center text-white bg-red-500 border-2 border-red-900 absolute justify-center "
                                >
                                    X
                                </button>
                            </div>
                        );
                    }
                )}
            </div>
            <div
                className={`relative grid gap-0 phone:grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-5 desktopxl:grid-cols-7 my-auto
                w-full h-auto mb-4 ${
                    cardsExtraDeck.length > 0
                        ? "border-purple-900 bg-indigo-950 border-2"
                        : ""
                }`}
            >
                <h2
                    className={`${
                        cardsExtraDeck.length > 0
                            ? "absolute text-base right-0 -m-6 border-2 rounded-md p-1 bg-violet-700 mr-52"
                            : ""
                    }`}
                >
                    {`${
                        cardsExtraDeck.length > 0
                            ? `Total de cartas: ${cardsExtraDeck.length}`
                            : ""
                    }
                    `}
                </h2>
                <h2
                    className={`${
                        priceCardExtraDeck > 0
                            ? "absolute text-base right-0 -m-6 border-2 rounded-md p-1 bg-violet-700"
                            : ""
                    }`}
                >
                    {`${
                        priceCardExtraDeck > 0
                            ? `Valor do extra deck: U$ ${priceCardExtraDeck.toFixed(
                                  2
                              )}`
                            : ""
                    }
                        `}
                </h2>
                {cardsExtraDeck.map(
                    (cardsToShow: CardDescription, index: number) => {
                        return (
                            <div className="p-2 flex flex-row" key={index}>
                                <img
                                    className="static "
                                    src={cardsToShow.image_url_small}
                                    alt={cardsToShow.name}
                                />
                                <button
                                    onClick={() =>
                                        removeCard(cardsExtraDeck, index)
                                    }
                                    className="p-1 h-10 w-10 mt-52 text-center text-white bg-red-500 border-2 border-red-900 absolute justify-center"
                                >
                                    X
                                </button>
                            </div>
                        );
                    }
                )}
            </div>
            <form
                className="font-white font-bold flex gap-2 pt-4"
                onSubmit={handleSubmit}
            >
                <input
                    className="rounded-md placeholder-slate-300 font-white bg-slate-900"
                    type="text"
                    placeholder="Search your Card"
                    onChange={handleInputChange}
                />
                <button
                    className="bg-purple-500 hover:bg-purple-600 "
                    type="submit"
                >
                    Search
                </button>
            </form>
            <div className="flex flex-wrap flex-row items-center justify-center gap-8 my-16 w-full">
                {card &&
                    card.map((cardReturned: CardDescription, index: number) => {
                        return (
                            //aqui
                            <div
                                className="border-2 border-purple-900 rounded-md p-2 flex flex-row bg-violet-950"
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
                                        className="mt-10 self-end border-2 border-purple-900 bg-stone-800 hover:bg-neutral-900"
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
// function docRef(
//     db: Firestore,
//     arg1: string
// ): import("@firebase/firestore").DocumentReference<
//     unknown,
//     {
//         mainDeck: CardDescription[];
//         extraDeck: CardDescription[];
//         deckName: string;
//     }
// > {
//     throw new Error("Function not implemented.");
// }

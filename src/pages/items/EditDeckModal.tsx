import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import {
    getDocs,
    collection,
    getFirestore,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseConfig } from "../../services/firestore";

interface Card {
    card_price: string;
    archetype: string;
    name: string;
    id: number;
    desc: string;
    frameType: string;
    image_url_small: string;
}

// interface Deck {
//     mainDeck: Card[];
//     mainDeckTotalPrice: number;
//     extraDeckTotalPrice: number;
//     deckName: string;
//     extraDeck: Card[];
//     id: string;
// }

// interface DeckProps {
//     deck: Deck;
// }

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

export default function EditDeckModal({
    isOpen,
    closeModal,
    deckType,
    deckNameIndex,
    origin,
}: any) {
    const [data, setData] = useState<any>([]);

    // const currentUser = getAuth().currentUser?.uid;
    // const [decksSelected, setDecksSelected] = useState(currentUser);
    const [deckNameSelected, setDeckNameSelected] = useState<any>("");
    const [card, setCard] = useState<CardDescription>();
    const [searchCard, setSearchCard] = useState("");

    let [priceCardMainDeck, setPriceCardMainDeck] = useState<any>(0);
    let [priceCardExtraDeck, setPriceCardExtraDeck] = useState<any>(0);
    let [cardsMainDeck, setCardsMainDeck] = useState<CardDescription[]>([]);
    let [cardsExtraDeck, setCardsExtraDeck] = useState<CardDescription[]>([]);

    const db: any = getFirestore(firebaseConfig);
    const currentUserUID = getAuth().currentUser?.uid;

    const fetchData = async () => {
        if (deckType) {
            const querySnapshot = await getDocs(collection(db, deckType));
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setData(newData);
            setDeckNameSelected(data[deckNameIndex].deckName);

            const settingMainDeck = [...data[deckNameIndex].mainDeck];
            const settingExtraDeck = [...data[deckNameIndex].extraDeck];
            const settingPriceMainDeck = data[deckNameIndex].mainDeckTotalPrice;
            const settingPriceExtraDeck =
                data[deckNameIndex].extraDeckTotalPrice;
            setCardsMainDeck(settingMainDeck);
            setCardsExtraDeck(settingExtraDeck);
            setPriceCardMainDeck(settingPriceMainDeck);
            setPriceCardExtraDeck(settingPriceExtraDeck);
        } else {
            console.log("erro no fetch");
        }
    };

    useEffect(() => {
        fetchData();
    }, [deckNameIndex]);

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

    const addData = async () => {
        const docRef = doc(db, currentUserUID, deckNameSelected);

        await setDoc(
            docRef,
            {
                mainDeck: [...cardsMainDeck],
                extraDeck: [...cardsExtraDeck],
                deckName: deckNameSelected,
                mainDeckTotalPrice: priceCardMainDeck,
                extraDeckTotalPrice: priceCardExtraDeck,
            },
            { merge: true }
        );
    };

    const updateDocument = async () => {
        try {
            const docRef = doc(
                db,
                currentUserUID,
                data[deckNameIndex].deckName
            );
            await updateDoc(docRef, {
                deckName: deckNameSelected,
                mainDeck: [...cardsMainDeck],
                extraDeck: [...cardsExtraDeck],
                mainDeckTotalPrice: priceCardMainDeck,
                extraDeckTotalPrice: priceCardExtraDeck,
            });
        } catch (error) {
            console.log("Erro ao atualizar o deck: ", error);
        }
    };

    const handleSubmitToDataBase = (event: any) => {
        event.preventDefault();
        setPriceCardMainDeck(Number(priceCardMainDeck.toFixed(2)));
        setPriceCardExtraDeck(Number(priceCardExtraDeck.toFixed(2)));

        if (currentUserUID === undefined) {
            checkLoginToast();
            return;
        }

        if (!checkMinimunCardQuantity()) {
            needCardAddedToast();
            return;
        }
        if (deckNameSelected === "") {
            deckNameMissingToast();
            return;
        }

        if (origin === "newDeckButton") {
            addData();
            deckCreatedToast();
            return;
        }

        if (origin === "editButton") {
            updateDocument();
            deckCreatedToast();
            return;
        }
    };

    const checkMinimunCardQuantity = () => {
        if (cardsMainDeck.length === 0) {
            return false;
        }
        return true;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        showCards();
    };

    const handleInputChange = (event: any) => {
        event.preventDefault();
        setSearchCard(event.target.value);
    };

    const handleInputDeckName = (event: any) => {
        event.preventDefault();
        setDeckNameSelected(event.target.value);
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
            archetype:
                card.archetype !== undefined ? card.archetype : "archetypeNULL",
            desc: card.desc,
            image_url_small: card.card_images[0].image_url_small,
            frameType: card.frameType,
            card_price: card.card_prices[0].tcgplayer_price,
        };

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

    const renderMainDeckCardElements = () => {
        const mainDeckCardElements = [];
        for (let index = 0; index < cardsMainDeck.length; index++) {
            const card = cardsMainDeck[index];
            const mainDeckCardElement = (
                <img
                    key={index}
                    src={card.image_url_small}
                    alt={card.name}
                    className="h-[7.5rem] border-2 rounded-md border-purple-400 cursor-pointer hover:border-red-500"
                    onClick={() => {
                        removeCard(cardsMainDeck, index);
                    }}
                />
            );
            mainDeckCardElements.push(mainDeckCardElement);
        }
        return mainDeckCardElements;
    };
    const renderExtraDeckCardElements = () => {
        const extraDeckCardElements = [];
        for (let index = 0; index < cardsExtraDeck.length; index++) {
            const card = cardsExtraDeck[index];
            const extraDeckCardElement = (
                <img
                    key={index}
                    src={card.image_url_small}
                    alt={card.name}
                    className="h-[7.5rem] border-2 rounded-md border-purple-400 cursor-pointer hover:border-red-500"
                    onClick={() => {
                        removeCard(cardsExtraDeck, index);
                    }}
                />
            );
            extraDeckCardElements.push(extraDeckCardElement);
        }
        return extraDeckCardElements;
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
        <div
            className={`fixed inset-0 flex items-center justify-center ${
                isOpen ? "visible" : "hidden"
            }`}
        >
            <ToastContainer />

            <div className="flex flex-col relative gap-2 justify-center  w-11/12 h-5/6 bg-slate-100 p-4 rounded-md  overflow-auto">
                {/* <div className="relative  ml-1 -mb-30 pt-auto"> */}
                <form
                    className="mt-[45rem] ml-1"
                    onSubmit={handleSubmitToDataBase}
                >
                    <input
                        className=" bg-violet-600 border-violet-900 placeholder-white rounded-md  w-[15rem]"
                        type="text"
                        placeholder={deckNameSelected}
                        onChange={handleInputDeckName}
                    />
                    <button
                        className="ml-2 py-2 px-4 bg-purple-700 hover:bg-purple-600 "
                        type="submit"
                    >
                        Salvar
                    </button>
                </form>
                <button
                    onClick={closeModal}
                    className="fixed ml-[90%] -mt-[47rem] bg-red-500 text-white py-2 px-4 rounded-md"
                >
                    X
                </button>

                <div className="">
                    <p className="absolute text-base  right-[24.5rem]  border-2 rounded-md p-1 bg-violet-700">
                        {cardsMainDeck.length} cartas - U$
                        {parseFloat(priceCardMainDeck).toFixed(2)}
                    </p>
                    <div className="grid grid-cols-8 gap-2 bg-purple-700 border-2 border-purple-950 mx-[0.3rem] p-2 h-[66rem] mt-4 w-[66%] rounded-md">
                        {renderMainDeckCardElements()}
                    </div>
                </div>
                <div className="mt-auto">
                    <p className="absolute text-base  right-[24.5rem]   border-2 rounded-md p-1 bg-violet-700">
                        {cardsExtraDeck.length} cartas - U$
                        {parseFloat(priceCardExtraDeck).toFixed(2)}
                    </p>
                    <div className="mt-4 grid grid-cols-8 gap-2 bg-purple-700 border-2 border-purple-950 mx-[0.3rem] p-2 h-[16.6rem] w-[66%] rounded-md">
                        {renderExtraDeckCardElements()}
                    </div>
                </div>
                <div className="absolute top-[0.6rem] right-1 w-1/3 h-[66rem] mt-[6rem] bg-purple-700 border-2 border-purple-950 rounded-md overflow-auto">
                    <form
                        className=" bg-purple-700 p-1 w-[22.3rem]"
                        onSubmit={handleSubmit}
                    >
                        <input
                            className=" bg-violet-600 border-violet-900  placeholder-white rounded-md  w-[12rem] m-2"
                            type="text"
                            placeholder="Procure aqui"
                            onChange={handleInputChange}
                        />
                        <button
                            className="ml-2 py-2 px-4 bg-purple-700 hover:bg-purple-600 "
                            type="submit"
                        >
                            Salvar
                        </button>
                    </form>
                    <div className="grid grid-cols-4 mx-2 ">
                        {card &&
                            card.map(
                                (
                                    cardReturned: CardDescription,
                                    index: number
                                ) => {
                                    return (
                                        <div
                                            className="border-2 w-[5.4rem]"
                                            key={index}
                                            onClick={() => {
                                                handleAddToDeck(cardReturned);
                                            }}
                                        >
                                            <img
                                                className="h-[7.5rem]"
                                                src={`https://images.ygoprodeck.com/images/cards_small/${cardReturned.id}.jpg`}
                                                alt={cardReturned.name}
                                            />
                                        </div>
                                    );
                                }
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
    // });
}

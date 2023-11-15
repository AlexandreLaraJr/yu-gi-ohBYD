import { useEffect, useState } from "react";
// import YgoFetch from "../../services/YgoFetch";

type CardDescription = {
    image_url_small: string | undefined;
    map: any;
    id: number;
    name: string;
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

    let [cardsToSend, setCardsToSend] = useState<CardDescription[]>([]);

    useEffect(() => {
        console.log("useEffect rodou");
    }, [cardsToSend]);

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
        console.log("funcao chamada");
    };
    const handleInputChange = (event: any) => {
        event.preventDefault();
        setSearchCard(event.target.value);
    };

    // const handleAddToDeck = (card: CardDescription) => {
    //     setCardsToSend((prevCards) => {
    //         if (prevCards.some((id) => id === card.id)) {
    //             return [...prevCards, card.id + "1"];
    //         } else {
    //             return [...prevCards, card.id++];
    //         }
    //     });
    // };

    const handleAddToDeck = (card: any) => {
        const cardToAdd = {
            id: card.id,
            name: card.name,
            image_url_small: card.card_images[0].image_url_small,
        };
        setCardsToSend((prevCards: any) => [...prevCards, cardToAdd]);
        console.log(`SÓ O CARD ${card.id}`);
        console.log(...cardsToSend);
    };

    return (
        <>
            {cardsToSend.map((cardsToShow: CardDescription, index: number) => {
                return (
                    <div className="z-1000" key={index}>
                        <p>{cardsToShow.name}</p>
                        <img src={cardsToShow.image_url_small} alt="" />
                    </div>
                );
            })}
            <form className="font-black" onSubmit={handleSubmit}>
                <input
                    className="font-black bg-slate-600"
                    type="text"
                    placeholder="nome da carta"
                    onChange={handleInputChange}
                />
                <button type="submit">Submit</button>
            </form>
            <div className="flex flex-wrap flex-row justify-center gap-8 my-16">
                {card &&
                    card.map((cardReturned: CardDescription, index: number) => {
                        return (
                            <div className="border-2 p-2" key={index}>
                                <div className="flex flex-col w-60">
                                    <img
                                        className=""
                                        src={`https://images.ygoprodeck.com/images/cards/${cardReturned.id}.jpg`}
                                        alt={cardReturned.name}
                                    />
                                    <p className="mt-2 self-end">
                                        {cardReturned.name}
                                    </p>
                                    {/* <p className="self-end">{`U$${cardReturned.card_prices[0].tcgplayer_price}`}</p> */}
                                    <button
                                        className="mt-2 self-center"
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

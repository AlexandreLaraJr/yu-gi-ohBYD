// type CardDescription = {
//     id: number;
//     name: string;
//     frameType: string;
//     card_sets: Array<object>;
//     card_images: Array<object>;
// };

import { SetStateAction, useEffect, useState } from "react";

type YgoFetchProps = {
    cardName: string;
    id: any;
    name: any;
    frameType: any;
    card_sets: Array<object>;
    card_images: Array<object>;
    onData?: (data: SetStateAction<null>) => void;
};

const YgoFetch: React.FC<YgoFetchProps> = ({ cardName }) => {
    const [data, setData] = useState<YgoFetchProps | null>(null);

    useEffect(() => {
        fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${cardName}`)
            .then((response) => {
                console.log(response); // log the response
                return response.json();
            })
            .then((data) => {
                const { id, name, frameType, card_sets, card_images } = data;
                setData({
                    id,
                    name,
                    frameType,
                    card_sets,
                    card_images,
                    cardName,
                });
                console.log(data.data.forEach((e) => {}));
            })
            .catch((error) => console.error("Error:", error));
    }, [cardName]);

    return <div>{JSON.stringify(data)}</div>;
};

export default YgoFetch;
// const [card, setCard] = useState<CardDescription>();
// const [searchCard, setSearchCard] = useState("");
// const handleSubmit = (event: any) => {
//     event.preventDefault();
//     showCards();
//     console.log("funcao chamada");
// };
// const showCards = () => {
//     if (searchCard !== "") {
//         fetch(
//             `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${searchCard}`
//         )
//             .then((response) => response.json())
//             .then((data) => {
//                 setCard(data.data);
//             });
//     }
// };
// const handleInputChange = (event: any) => {
//     event.preventDefault();
//     setSearchCard(event.target.value);
// };
// return (
//     <>
//         <form className="font-black" onSubmit={handleSubmit}>
//             <input
//                 className="font-black bg-slate-600"
//                 type="text"
//                 placeholder="nome da carta"
//                 onChange={handleInputChange}
//             />
//             <button type="submit">Submit</button>
//         </form>
//         <div className="flex flex-wrap flex-row justify-center gap-8 my-16">
//             {card &&
//                 card.map((cardReturned: CardDescription) => {
//                     return (
//                         <div className="border-2 p-2">
//                             <div
//                                 className="flex flex-col w-60"
//                                 key={cardReturned.id}
//                             >
//                                 <img
//                                     className=""
//                                     src={`https://images.ygoprodeck.com/images/cards/${cardReturned.id}.jpg`}
//                                     alt={cardReturned.name}
//                                 />
//                                 <p className="mt-2 self-end">
//                                     {cardReturned.name}
//                                 </p>
//                                 {/* <p className="self-end">{`U$${cardReturned.card_prices[0].tcgplayer_price}`}</p> */}
//                                 <button className="mt-2 self-center">
//                                     Add to my deck
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//         </div>
//     </>
// );
// }

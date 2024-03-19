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
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDeckModal from "./EditDeckModal";

const db: any = getFirestore(firebaseConfig);

export default function ListDecks() {
    const [data, setData] = useState<any>([]);
    const [deckRemoved, setDeckRemoved] = useState<boolean>(false);

    const currentUser = getAuth().currentUser?.uid;
    const [deckTypeSelected, setDeckTypeSelected] = useState(currentUser);
    const [deckNameIndex, setDeckNameIndex] = useState<Number>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originButton, setOriginButton] = useState<
        "newDeckButton" | "editButton"
    >("newDeckButton");

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchData = async () => {
        if (deckTypeSelected) {
            const querySnapshot = await getDocs(
                collection(db, deckTypeSelected)
            );
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setData(newData);
        }
    };

    useEffect(() => {
        fetchData();
    }, [deckRemoved]);

    useEffect(() => {
        fetchData();
    }, [deckTypeSelected]);

    const deckNameToSend = (index: Number) => {
        setDeckNameIndex(index);
    };

    const removeDeck = async (deckName: string, _index: number) => {
        try {
            await deleteDoc(doc(db, currentUser, deckName));
            setDeckRemoved((prev) => !prev);
            deleteDeckToast();
        } catch (error: any) {
            toast.error(`Erro ao excluir deck ${error}`, {
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
        }
    };

    const deleteDeckToast: any = () => {
        toast.success("Deck excluído com sucesso!", {
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
        <div className="overflow-auto -mt-10 mb-20 mx-[auto]">
            <div className="flex flex-row  gap-2 mx-auto ml-10 mb-4">
                <button
                    className="bg-violet-700"
                    onClick={() => setDeckTypeSelected(currentUser)}
                >
                    Meus Decks
                </button>
                <button
                    className="bg-violet-700"
                    onClick={() => setDeckTypeSelected("public")}
                >
                    Decks publicos
                </button>
            </div>
            <div className=" ">
                <div className="flex flex-wrap justify-center  min-w-[40rem]">
                    <div
                        className={`w-[14.9rem] mx-[5.3rem] mb-2 flex flex-col justify-center ${
                            deckTypeSelected !== "public" ? "" : "hidden"
                        }`}
                    >
                        <button
                            onClick={() => {
                                openModal();
                                setOriginButton("newDeckButton");
                            }}
                            className="rounded-full h-[8rem] w-[8rem] border-2 mx-auto border-purple-950 bg-purple-700 hover:bg-purple-500 "
                        >
                            <h1 className="pb-2.5 text-7xl font-bold text-clip">
                                +
                            </h1>
                        </button>
                        <p className="mx-auto mt-4 font-bold">Novo Deck</p>
                    </div>
                    {data.length === 0 ? (
                        <h2 className="text-2xl">
                            {currentUser !== undefined
                                ? "Você não possui nenhum deck salvo!"
                                : "Ainda não existe nenhum deck publico!"}
                        </h2>
                    ) : (
                        data.map((showDeck: any, index: any) => {
                            return (
                                <div
                                    className="border-2 border-purple-800 rounded-md w-[25rem] flex flex-row mr-2 mb-2"
                                    key={index}
                                >
                                    <img
                                        className="w-[8rem] m-4"
                                        src={
                                            showDeck.mainDeck[0].image_url_small
                                        }
                                        alt=""
                                    />
                                    <div className="flex flex-col justify-between">
                                        <button
                                            onClick={() => {
                                                removeDeck(
                                                    showDeck.deckName,
                                                    index
                                                );
                                            }}
                                            className={`${
                                                deckTypeSelected !== "public"
                                                    ? ""
                                                    : "hidden"
                                            } p-1 h-10 w-10 ml-[12rem] text-center text-white bg-red-500 border-red-900  border-2 absolute justify-center `}
                                        >
                                            X
                                        </button>
                                        <button
                                            onClick={() => {
                                                openModal();
                                                deckNameToSend(index);
                                                setOriginButton("editButton");
                                            }}
                                            className={`${
                                                deckTypeSelected !== "public"
                                                    ? ""
                                                    : "ml-[10.7rem]"
                                            } py-1 px-4 h-10 w-15 mt-44 ml-[7.8rem] text-center text-white bg-purple-500 border-purple-900  border-2 absolute justify-center `}
                                        >
                                            {`${
                                                deckTypeSelected !== "public"
                                                    ? "Ver/Editar"
                                                    : "Ver"
                                            } `}
                                        </button>

                                        <h2 className="text-2xl">
                                            {showDeck.deckName}
                                        </h2>
                                        <p className="">
                                            Preço: U$
                                            {(
                                                Number(
                                                    data[index]
                                                        .mainDeckTotalPrice
                                                ) +
                                                Number(
                                                    data[index]
                                                        .extraDeckTotalPrice
                                                )
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* <BuildedDecks /> */}
                </div>
            </div>
            <EditDeckModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                deckType={deckTypeSelected}
                deckNameIndex={deckNameIndex}
                origin={originButton}
            />
        </div>
    );
}

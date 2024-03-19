import { Link, Outlet } from "react-router-dom";
import LoginModal from "./items/LoginModal";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLogout, setUserLogout] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const auth = getAuth();

    useEffect(() => {}, [userLogout]);

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                setUserLogout((prev) => !prev);
                logoutSuccessToast();
            })
            .catch((error) => {
                logoutErrorToast();
                console.log(error);
            });
    };

    const logoutSuccessToast: any = () => {
        toast.success("Logout efetuado com sucesso!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    const logoutErrorToast: any = () => {
        toast.error("Erro ao efetuar logout!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };
    return (
        <>
            <header className="z-10 fixed top-0 w-screen p-2 px-6 flex flex-row place-content-between mb-4 bg-violet-900">
                <h2 className="ml-2 self-center  font-semibold">
                    <Link className="text-white hover:text-white" to="/">
                        Yu-Gi-Oh BYD
                    </Link>
                </h2>
                <div className="flex flex-row gap-4 my-auto">
                    <Link
                        className="self-center text-white hover:text-black"
                        to="/decks"
                    >
                        Decks
                    </Link>

                    <Link
                        className="self-center text-white hover:text-black"
                        to="/combos"
                    >
                        Combos
                    </Link>
                    <button
                        onClick={() => {
                            getAuth().currentUser?.uid !== undefined
                                ? userSignOut()
                                : openModal();
                        }}
                        className="bg-violet-700 hover:bg-violet-950 transition duration-500 ease-in-out"
                    >
                        {getAuth().currentUser?.uid !== undefined
                            ? "Logout"
                            : "Login"}
                    </button>
                    <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
                </div>
            </header>
            <div>
                <Outlet />
            </div>
            <footer className="z-10 fixed bottom-0 h-12 w-full bg-violet-900 text-center p-2.5">
                Created by AlexandreLara
            </footer>
        </>
    );
}

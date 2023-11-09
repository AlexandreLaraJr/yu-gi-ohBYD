import { Link, Outlet, useLocation } from "react-router-dom";

export default function Decks() {
    const { pathname } = useLocation();

    return (
        <main className="flex flex-col  absolute top-12 m-12">
            <h2 className="font-bold text-2xl">Decks</h2>
            <div className="py-4">
                <Link
                    className={`p-2 border-b hover:border-b-2 hover:mb-0 text-white hover:text-white ${
                        pathname === "/decks"
                            ? "border-b-2 font-bold"
                            : "border-b"
                    }`}
                    to="/decks"
                >
                    Todos os decks
                </Link>
                <Link
                    className={`p-2 border-b hover:border-b-2 hover:mb-0 text-white hover:text-white ${
                        pathname === "/decks/new"
                            ? "border-b-2 font-bold"
                            : "border-b"
                    }`}
                    to="/decks/new"
                >
                    Novo deck
                </Link>
            </div>
            <Outlet />
        </main>
    );
}

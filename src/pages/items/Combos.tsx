import { Link, Outlet, useLocation } from "react-router-dom";

export default function Combos() {
    const { pathname } = useLocation();

    return (
        <main className="flex flex-col  absolute top-12 m-12">
            <h2 className="font-bold text-2xl">Combos</h2>
            <div className="py-4">
                <Link
                    className={`p-2 border-b hover:border-b-2 hover:mb-0 text-white hover:text-white ${
                        pathname === "/combos"
                            ? "border-b-2 font-bold"
                            : "border-b"
                    }`}
                    to="/combos"
                >
                    Todos os combos
                </Link>
                <Link
                    className={`p-2 border-b hover:border-b-2 hover:mb-0 text-white hover:text-white ${
                        pathname === "/combos/new"
                            ? "border-b-2 font-bold"
                            : "border-b"
                    }`}
                    to="/combos/new"
                >
                    Novo combo
                </Link>
            </div>
            <Outlet />
        </main>
    );
}

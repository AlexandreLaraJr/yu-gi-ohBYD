import { Link, Outlet } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";

export default function RootLayout() {
    return (
        <>
            <header className="z-10 fixed top-0 w-screen p-2 px-6 flex flex-row place-content-between mb-4 bg-violet-900">
                <h2 className="ml-2 self-center  font-semibold">
                    <Link className="text-white hover:text-white" to="/">
                        Yu-Gi-Oh BYD
                    </Link>
                </h2>

                <DropdownMenu />
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

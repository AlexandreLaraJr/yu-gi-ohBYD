import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import Decks from "./pages/items/Decks";
import ListDecks from "./pages/items/ListDecks";
import CreateDecks from "./pages/items/CreateDecks";
import ShowDecks from "./pages/items/ShowDecks";
import UpdateDecks from "./pages/items/UpdateDecks";
import Combos from "./pages/items/Combos";
import ListCombos from "./pages/items/ListCombos";
import CreateCombos from "./pages/items/CreateCombos";
import ShowCombos from "./pages/items/ShowCombos";
import UpdateCombos from "./pages/items/UpdateCombos";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            {
                path: "decks",
                element: <Decks />,
                children: [
                    { index: true, element: <ListDecks /> },
                    { path: "new", element: <CreateDecks /> },
                    { path: ":id", element: <ShowDecks /> },
                    { path: ":id/update", element: <UpdateDecks /> },
                ],
            },

            {
                path: "combos",
                element: <Combos />,
                children: [
                    { index: true, element: <ListCombos /> },
                    { path: "new", element: <CreateCombos /> },
                    { path: ":id", element: <ShowCombos /> },
                    { path: ":id/update", element: <UpdateCombos /> },
                ],
            },
        ],
    },
]);

export default router;

import { RouterProvider } from "react-router-dom";
import router from "./router";
import { DecksContextProvider } from "./contexts/DecksContext";

export default function App() {
    return (
        <div className="static">
            <DecksContextProvider value={{}}>
                <RouterProvider router={router} />
            </DecksContextProvider>
        </div>
    );
}

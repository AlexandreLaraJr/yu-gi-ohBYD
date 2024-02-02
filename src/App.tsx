import { RouterProvider } from "react-router-dom";
import router from "./router";
import { DecksContextProvider } from "./contexts/DecksContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});

export default function App() {
    return (
        <div className="static">
            <DecksContextProvider value={{}}>
                <RouterProvider router={router} />
            </DecksContextProvider>
        </div>
    );
}

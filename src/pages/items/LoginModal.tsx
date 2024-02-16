import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../../services/firestore";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const provider = new GoogleAuthProvider();

export default function LoginModal({ isOpen, closeModal }: any) {
    const signInGoogle = () => {
        const auth = getAuth(firebaseConfig);
        signInWithPopup(auth, provider)
            .then((result) => {
                // const credential: any =
                //     GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                loginSuccessToast();
                closeModal();
                const userID = result.user.uid;
                console.log(userID);
            })
            .catch((error: any) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage);
                // const email = error.customData.email;
                // const credential =
                //     GoogleAuthProvider.credentialFromError(error);
            });
    };

    const loginSuccessToast: any = () => {
        toast.success("Login efetuado com sucesso!", {
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
        <div
            className={`fixed inset-0 flex items-center justify-center ${
                isOpen ? "visible" : "hidden"
            }`}
        >
            <ToastContainer />
            <div className="flex flex-col items-center justify-center absolute w-1/3 h-4/6 bg-slate-100 p-4 rounded-md shadow-md ">
                <button
                    onClick={closeModal}
                    className="fixed ml-[32%] -mt-[38rem] bg-red-500 text-white py-2 px-4 rounded-md"
                >
                    X
                </button>
                <h1 className="text-purple-800">Yu-Gi-Oh BYD</h1>
                <p className="text-black">Login</p>
                <form className="flex flex-col">
                    <input type="text" />
                    <button
                        type="submit"
                        className="bg-purple-700 w-20 self-center mt-4"
                    >
                        Login
                    </button>
                </form>
                <button
                    className="bg-purple-700 w-auto self-center mt-4"
                    onClick={() => signInGoogle()}
                >
                    Entre com o google
                </button>
            </div>
        </div>
    );
}

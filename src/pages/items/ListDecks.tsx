import BuildedDecks from "../../components/BuildedDecks";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firestore";
import { useState, useEffect } from "react";

export default function ListDecks() {
    const [data, setData] = useState<any>([]);

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "decks"));
        const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setData(newData);
        console.log(newData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <h2>Mostrando todos decks</h2>
            <BuildedDecks />
        </>
    );
}

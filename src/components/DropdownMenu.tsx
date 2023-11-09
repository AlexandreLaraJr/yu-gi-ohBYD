"use client";

import { CustomFlowbiteTheme, Dropdown, Flowbite } from "flowbite-react";
import { Link } from "react-router-dom";

const customTheme: CustomFlowbiteTheme = {
    button: {
        color: {
            primary: "bg-purple-500 hover:bg-purple-600",
        },
    },
};

export default function DropdownMenu() {
    return (
        <Flowbite theme={{ theme: customTheme }}>
            <div className="flex items-center gap-4">
                <Dropdown color="primary" label="Dropdown" size="sm">
                    <Dropdown.Item>
                        <Link to="/decks">Decks</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link to="/combos">Combos</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
            </div>
        </Flowbite>
    );
}

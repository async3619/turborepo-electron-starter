import React from "react";
import { useCloseWindowMutation } from "@graphql/queries";

export function Home() {
    const [closeWindow] = useCloseWindowMutation();

    return (
        <div>
            <span>Home</span>
            <button onClick={() => closeWindow()}>Close</button>
        </div>
    );
}

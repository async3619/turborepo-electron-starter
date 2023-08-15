import React from "react";

export interface AppProps {}

declare global {
    interface Window {
        electron: {
            getHelloWorld: () => string;
        };
    }
}

export function App({}: AppProps) {
    return (
        <div>
            <span>{window.electron.getHelloWorld()}</span>
        </div>
    );
}

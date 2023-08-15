import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
    getHelloWorld: () => {
        return "Hello World!";
    },
});

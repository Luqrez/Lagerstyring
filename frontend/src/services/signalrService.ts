// src/services/signalrService.ts
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

let connection: HubConnection | null = null;
const listeners: { [key: string]: Function[] } = {};

// Opretter og vedligeholder en live-forbindelse til serveren, så brugere altid modtager øjeblikkelige lageropdateringer uden forsinkelser.
export const getConnection = () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5212/realtime/beholdning")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("SignalR connected"))
            .catch((err) => console.error("SignalR connection error:", err));
    }

    return connection;
};

// Tilføjer en ny lytterfunktion, som sikrer at medarbejderne automatisk får opdateringer når lagerstatus ændres.
export const addListener = (eventName: string, callback: Function) => {
    if (!listeners[eventName]) {
        listeners[eventName] = [];
        getConnection().on(eventName, (...args: any[]) => {
            listeners[eventName].forEach(cb => cb(...args));
        });
    }

    listeners[eventName].push(callback);
};

// Fjerner en eksisterende lytter, når en medarbejder ikke længere ønsker opdateringer, hvilket sikrer optimal ydeevne og unødvendigt netværkstrafik reduceres.
export const removeListener = (eventName: string, callback: Function) => {
    if (listeners[eventName]) {
        listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
    }
};

// Lukker forbindelsen, når systemet ikke længere bruges, hvilket reducerer ressourceforbrug og øger stabiliteten af applikationen.
export const closeConnection = async () => {
    if (connection) {
        await connection.stop();
        connection = null;
        console.log("SignalR connection closed");
    }
};

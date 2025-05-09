// src/services/signalrService.ts
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getApiUrl, API_ENDPOINTS } from "../lib/apiConfig";

let connection: HubConnection | null = null;
const listeners: { [key: string]: Function[] } = {};

export const getConnection = () => {
    if (!connection) {
        connection = new HubConnectionBuilder()
            .withUrl(getApiUrl(API_ENDPOINTS.REALTIME))
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("SignalR connected"))
            .catch((err) => console.error("SignalR connection error:", err));
    }

    return connection;
};

export const addListener = (eventName: string, callback: Function) => {
    if (!listeners[eventName]) {
        listeners[eventName] = [];
        getConnection().on(eventName, (...args: any[]) => {
            listeners[eventName].forEach(cb => cb(...args));
        });
    }

    listeners[eventName].push(callback);
};

export const removeListener = (eventName: string, callback: Function) => {
    if (listeners[eventName]) {
        listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
    }
};

export const closeConnection = async () => {
    if (connection) {
        await connection.stop();
        connection = null;
        console.log("SignalR connection closed");
    }
};

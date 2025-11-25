import { Client, Account, Databases } from 'appwrite';

// Configuración del cliente de Appwrite
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Servicios de Appwrite
export const account = new Account(client);
export const databases = new Databases(client);

// Constantes de configuración
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const RECYCLING_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RECYCLING_COLLECTION_ID;
export const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;

export default client;

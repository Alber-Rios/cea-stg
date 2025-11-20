// js/appwrite.js

// Usamos el CDN oficial de Appwrite
import { Client, Databases } from 'https://cdn.appwrite.io/web/sdk/10.0.0/client/web/appwrite.min.js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('691f27f8002fe4890ddd'); // Tu Project ID real

export const databases = new Databases(client);

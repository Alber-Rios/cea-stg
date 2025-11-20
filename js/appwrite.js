// js/appwrite.js

import { Client, Databases } from 'https://cdn.jsdelivr.net/npm/appwrite@10.0.0/dist/web/appwrite.min.js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Endpoint público
    .setProject('691f27f8002fe4890ddd'); // ¡Tu Project ID real!

export const databases = new Databases(client);

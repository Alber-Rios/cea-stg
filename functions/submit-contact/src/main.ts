import { Client, Databases } from 'node-appwrite';

// Definir interfaces básicas para evitar 'any' implícito
interface AppwriteFunctionContext {
    req: any;
    res: any;
    log: (message: any) => void;
    error: (message: any) => void;
}

export default async ({ req, res, log, error }: AppwriteFunctionContext) => {
    // 1. Verificar método
    if (req.method !== 'POST') {
        return res.json({ success: false, error: 'Method not allowed' }, 405);
    }

    try {
        // 2. Parsear datos
        const body = req.body ? JSON.parse(req.body) : {};
        const payload = body.payload;

        if (!payload || !payload.name || !payload.email || !payload.message) {
            return res.json({ success: false, error: 'Missing required fields' }, 400);
        }

        // 3. Inicializar cliente (SEGURO: Variables de entorno en el servidor)
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
            .setProject(process.env.APPWRITE_PROJECT_ID as string)
            .setKey(process.env.APPWRITE_API_KEY as string);

        const db = new Databases(client);

        // 4. Guardar en base de datos
        const document = await db.createDocument(
            'CEADB',           // ID Base de Datos
            'contacts',        // ID Colección
            'unique()',        // ID Documento
            {
                name: payload.name,
                email: payload.email,
                message: payload.message,
                createdAt: new Date().toISOString()
            }
        );

        return res.json({ success: true, data: document });

    } catch (e: any) {
        error(e.message);
        return res.json({ success: false, error: e.message }, 500);
    }
};

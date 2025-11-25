import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export const getAIResponse = async (prompt) => {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing");
        return "⚠️ No tengo configurada mi llave de inteligencia artificial. Por favor contacta al administrador.";
    }

    try {
        // Contexto para la IA sobre el CEA
        const context = `
            Eres el asistente virtual del Centro de Educación Ambiental (CEA) de la comuna de O'Higgins.
            Tu tono es amable, educativo y entusiasta sobre el medio ambiente.
            Responde de manera concisa (máximo 3 párrafos).
            
            Información clave del CEA:
            - Ubicación: Av. Beauchef 1327, Santiago (Interior Parque O'Higgins).
            - Horario: Lunes a Viernes de 09:00 a 18:00 hrs.
            - Misión: Educar sobre reciclaje, compostaje, huertos urbanos y sostenibilidad.
            - Servicios: Puntos limpios, talleres gratuitos, visitas guiadas.
            - Qué recibimos: Papel, cartón, vidrio, latas de aluminio, botellas PET 1.
            - Qué NO recibimos: Escombros, muebles, residuos peligrosos, electrónicos.
            
            Pregunta del usuario: ${prompt}
        `;

        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();
        
        // Formatear la respuesta para HTML básico si es necesario (saltos de línea)
        return text.replace(/\n/g, '<br/>');
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "😕 Lo siento, tuve un problema al procesar tu pregunta. Por favor intenta de nuevo más tarde.";
    }
};

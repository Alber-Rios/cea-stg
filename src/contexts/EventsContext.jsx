import { createContext, useContext, useState, useCallback } from 'react';

const EventsContext = createContext();

export function EventsProvider({ children }) {
    const [eventsVersion, setEventsVersion] = useState(0);

    // Función para notificar que los eventos han cambiado
    const notifyEventsChanged = useCallback(() => {
        setEventsVersion(prev => prev + 1);
    }, []);

    return (
        <EventsContext.Provider value={{ eventsVersion, notifyEventsChanged }}>
            {children}
        </EventsContext.Provider>
    );
}

export function useEventsContext() {
    const context = useContext(EventsContext);
    // Retornar valores por defecto si no está dentro del provider
    if (!context) {
        return {
            eventsVersion: 0,
            notifyEventsChanged: () => { }
        };
    }
    return context;
}

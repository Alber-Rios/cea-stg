import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, EVENTS_COLLECTION_ID } from '../config/appwriteConfig';
import { useEventsContext } from '../contexts/EventsContext';

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const { eventsVersion } = useEventsContext();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID
      );
      
      const formattedEvents = {};
      
      response.documents.forEach(doc => {
        const date = new Date(doc.date);
        
        // Usar zona horaria local para que coincida con el formulario del admin
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const key = `${day}-${month}-${year}`;
        
        if (!formattedEvents[key]) {
          formattedEvents[key] = [];
        }
        
        formattedEvents[key].push({
          title: doc.title,
          info: doc.description,
          id: doc.$id,
          time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        });
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventsVersion]); // Se recarga cuando cambia eventsVersion

  const changeMonth = (step) => {
    let newMonth = currentMonth + step;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return {
    currentMonth,
    currentYear,
    changeMonth,
    events,
    loading
  };
}

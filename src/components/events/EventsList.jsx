import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, EVENTS_COLLECTION_ID } from '../../config/appwriteConfig';
import { Query } from 'appwrite';
import styles from './EventsList.module.css';

function EventsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    [
                        Query.orderAsc('date'), // Ordenar por fecha más próxima
                        Query.greaterThanEqual('date', new Date().toISOString()) // Solo eventos futuros
                    ]
                );
                setEvents(response.documents);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const getDateInfo = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' });
        return { day, month };
    };

    if (loading) {
        return (
            <div className={styles.eventsList}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.eventItem} ${styles.skeleton}`}>
                        <div className={styles.eventDate}>
                            <div className={styles.skeletonBox} style={{ width: '40px', height: '40px' }}></div>
                        </div>
                        <div className={styles.eventInfo} style={{ width: '100%' }}>
                            <div className={styles.skeletonBox} style={{ width: '60%', height: '20px', marginBottom: '10px' }}></div>
                            <div className={styles.skeletonBox} style={{ width: '90%', height: '15px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.eventsList}>
            {events.length > 0 ? (
                events.map((event) => {
                    const { day, month } = getDateInfo(event.date);
                    return (
                        <div key={event.$id} className={styles.eventItem}>
                            <div className={styles.eventDate}>
                                <div className={styles.day}>{day}</div>
                                <div className={styles.month}>{month}</div>
                            </div>
                            <div className={styles.eventInfo}>
                                <h4>{event.title}</h4>
                                <p>{event.description}</p>
                                {event.url_inscripcion && (
                                    <a href={event.url_inscripcion} target="_blank" rel="noopener noreferrer" className={styles.btnRegister}>
                                        Inscribirse
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No hay eventos próximos.</p>
            )}
        </div>
    );
}

export default EventsList;

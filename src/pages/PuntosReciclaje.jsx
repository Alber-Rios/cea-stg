import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, RECYCLING_COLLECTION_ID } from '../config/appwriteConfig';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from './PuntosReciclaje.module.css';

function PuntosReciclaje() {
    const [puntosReciclaje, setPuntosReciclaje] = useState([]);
    const [loading, setLoading] = useState(true);
    useScrollAnimation([loading]);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    RECYCLING_COLLECTION_ID
                );
                setPuntosReciclaje(response.documents);
            } catch (error) {
                console.error('Error al cargar puntos de reciclaje:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, []);

    const ceaSede = { nombre: 'Sede Principal CEA', direccion: 'Av. Beauchef 1327', lat: -33.464272, lon: -70.661817 };

    return (
        <div className={styles.puntosReciclaje}>
            <section className="sub-header header-puntos">
                <h1>Puntos de Reciclaje</h1>
            </section>

            <section className={styles.introSection}>
                <h2 className="section-title">Red de Puntos Limpios en Santiago</h2>
                <p className={styles.description}>
                    Encuentra el punto de reciclaje más cercano a tu hogar. Contamos con una red de puntos fijos donde puedes llevar tus residuos reciclables como vidrio, plásticos (PET 1), papeles y cartones.
                </p>
                <div className={styles.infoBox}>
                    <h3>📦 ¿Qué puedes reciclar?</h3>
                    <ul>
                        <li>🍾 Vidrio (botellas y frascos limpios)</li>
                        <li>♻️ Plásticos PET 1 (botellas de bebidas)</li>
                        <li>📄 Papeles y cartones (limpios y secos)</li>
                    </ul>
                </div>
            </section>

            <section className={styles.listSection}>
                <h2 className="section-title">Lista de Puntos de Reciclaje</h2>

                <div className={styles.sedeCard}>
                    <div className={styles.cardHeader}>
                        <h3>🏢 {ceaSede.nombre}</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <p><strong>📍 Dirección:</strong> {ceaSede.direccion}</p>
                        <p><strong>🕒 Horario:</strong> Lunes a Viernes: 09:00 - 18:00 hrs</p>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${ceaSede.lat},${ceaSede.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mapButton}
                        >
                            📍 Ver en Google Maps
                        </a>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.pointsGrid}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className={`${styles.pointCard} ${styles.skeleton}`}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.skeletonBox} style={{ width: '60%', height: '24px' }}></div>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.skeletonBox} style={{ width: '80%', height: '18px', marginBottom: '10px' }}></div>
                                    <div className={styles.skeletonBox} style={{ width: '50%', height: '18px', marginBottom: '15px' }}></div>
                                    <div className={styles.skeletonBox} style={{ width: '40%', height: '35px', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.pointsGrid}>
                        {puntosReciclaje.map((punto, index) => (
                            <div key={index} className={`${styles.pointCard} fade-up`}>
                                <div className={styles.cardHeader}>
                                    <h3>♻️ {punto.name}</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p><strong>📍 Dirección:</strong> {punto.address}</p>
                                    {punto.schedule && <p><strong>🕒 Horario:</strong> {punto.schedule}</p>}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${punto.lat},${punto.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.mapButton}
                                    >
                                        📍 Ver en Google Maps
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default PuntosReciclaje;

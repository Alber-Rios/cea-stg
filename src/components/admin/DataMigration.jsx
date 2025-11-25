import { useState } from 'react';
import { databases, DATABASE_ID, RECYCLING_COLLECTION_ID, EVENTS_COLLECTION_ID } from '../../config/appwriteConfig';
import { ID } from 'appwrite';

const DataMigration = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    // Datos de Puntos de Reciclaje (Copiados de PuntosReciclaje.jsx)
    const puntosReciclaje = [
        { nombre: 'Zona de Aseo Mapocho', direccion: 'Mapocho #2752', horario: 'Lunes a Domingo de 08:00 hrs a 20:00 hrs.', lat: -33.43253, lon: -70.6744 },
        { nombre: 'Cesfam Arauco', direccion: 'Mirador #1599', horario: 'Lunes a Sábado de 10:00 hrs a 16:00 hrs.', lat: -33.46815, lon: -70.67033 },
        { nombre: 'Centro Comunitario Carol Urzúa', direccion: 'Av. Santa #1727', horario: 'Lunes a Domingo de 10:00 hrs a 18:00 hrs.', lat: -33.46773, lon: -70.64255 },
        { nombre: 'Oficina Adulto Mayor', direccion: 'Av. Matucana #272', horario: 'Lunes a Sábado de 14:00 hrs a 19:00 hrs.', lat: -33.44312, lon: -70.67994 },
        { nombre: 'Gimnasio J. López', direccion: 'Santa Helena #1675', horario: 'Lunes a Domingo de 10:00 hrs a 19:00 hrs.', lat: -33.46613, lon: -70.62892 },
        { nombre: 'Hermanita de los pobres', direccion: 'Carmen #1243', horario: 'Lunes a Domingo de 10:00 hrs a 18:00 hrs.', lat: -33.5171, lon: -70.76332 },
        { nombre: 'Acceso Parque O\'Higgins', direccion: 'Rondizzoni 6 Luis Cousiño', horario: 'Lunes a Domingo de 10:00 hrs a 20:00 hrs.', lat: -33.47003, lon: -70.65633 },
        { nombre: 'Plaza de bolsillo Santa Isabel', direccion: 'Lira esq. Santa Isabel', horario: 'Lunes a Domingo de 10:00 hrs a 18:00 hrs.', lat: -33.44964, lon: -70.63884 },
        { nombre: 'JJVV Gabriela Mistral', direccion: 'Diez de Julio #760', horario: 'Lunes a Viernes de 17:00 hrs a 20:00 hrs.', lat: -33.45392, lon: -70.64533 },
        { nombre: 'JJVV Adelanto y Progreso', direccion: 'Placer #530', horario: 'Lunes a Sábado de 09:00 hrs a 14:00 hrs.', lat: -33.47524, lon: -70.63666 },
        { nombre: 'ECOENGRANAJE', direccion: 'Pedro Antonio Gonzalez 3665', horario: 'Consultar web', lat: -33.46775, lon: -70.68547 },
        { nombre: 'Punto Limpio - Av. Del Parque', direccion: 'Avenida Del Parque 4951', horario: 'Consultar web', lat: -33.3895, lon: -70.61746 },
    ];

    const migrateData = async () => {
        if (!window.confirm('¿Estás seguro de migrar los datos? Esto creará duplicados si ya existen.')) return;

        setLoading(true);
        setStatus('Iniciando migración...');
        setError('');

        try {
            // 1. Migrar Puntos de Reciclaje
            setStatus(`Migrando ${puntosReciclaje.length} puntos de reciclaje...`);
            for (const punto of puntosReciclaje) {
                await databases.createDocument(
                    DATABASE_ID,
                    RECYCLING_COLLECTION_ID,
                    ID.unique(),
                    {
                        name: punto.nombre,
                        address: punto.direccion,
                        schedule: punto.horario,
                        lat: punto.lat,
                        lon: punto.lon
                    }
                );
            }

            setStatus('¡Migración completada con éxito! 🎉');
        } catch (err) {
            console.error('Error en migración:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="migration-section">
            <div className="migration-header">
                <span className="migration-icon">🚀</span>
                <h2>Migración de Datos</h2>
            </div>
            <p>Carga los Puntos de Reciclaje de prueba a la base de datos de Appwrite.</p>
            <p><small>Nota: Los eventos ahora se gestionan directamente desde el panel de Eventos.</small></p>

            {status && <div className="migration-status success">{status}</div>}
            {error && <div className="migration-status error">{error}</div>}

            <button
                onClick={migrateData}
                className="migration-button"
                disabled={loading}
            >
                {loading ? '⏳ Migrando datos...' : '📤 Cargar Datos de Prueba a Appwrite'}
            </button>
        </div>
    );
};

export default DataMigration;

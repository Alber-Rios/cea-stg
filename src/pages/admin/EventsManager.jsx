import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, EVENTS_COLLECTION_ID } from '../../config/appwriteConfig';
import { ID } from 'appwrite';
import { useEventsContext } from '../../contexts/EventsContext';
import '../../styles/Admin.css';

const EventsManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        url_inscripcion: ''
    });
    const [error, setError] = useState('');
    const { notifyEventsChanged } = useEventsContext();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                EVENTS_COLLECTION_ID
            );
            setEvents(response.documents);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            setError('Error al cargar los eventos');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // El input datetime-local devuelve "2025-12-05T10:00"
            // Crear fecha en zona horaria local y convertir a ISO (UTC)
            const localDate = new Date(formData.date);

            const data = {
                title: formData.title,
                date: localDate.toISOString(),
                description: formData.description,
                url_inscripcion: formData.url_inscripcion || null
            };

            if (editingEvent) {
                await databases.updateDocument(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    editingEvent.$id,
                    data
                );
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    ID.unique(),
                    data
                );
            }

            resetForm();
            fetchEvents();
            // Notificar que los eventos han cambiado
            notifyEventsChanged();
        } catch (error) {
            console.error('Error detallado al guardar:', error);
            // Mostrar mensaje más específico si está disponible
            setError(`Error al guardar: ${error.message || 'Verifica la consola'}`);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        // Convertir la fecha UTC a formato datetime-local en zona horaria local
        const fecha = new Date(event.date);
        const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);

        setFormData({
            title: event.title,
            date: fechaLocal,
            description: event.description,
            url_inscripcion: event.url_inscripcion || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este evento?')) {
            return;
        }

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                id
            );
            fetchEvents();
            // Notificar que los eventos han cambiado
            notifyEventsChanged();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setError('Error al eliminar el evento');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            date: '',
            description: '',
            url_inscripcion: ''
        });
        setEditingEvent(null);
        setShowForm(false);
        setError('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="manager-container">
            <div className="manager-header">
                <h1>📅 Eventos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Evento'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="form-card">
                    <h2>{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Título *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Taller de Compostaje"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha y Hora *</label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe el evento..."
                                maxLength={5000}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>URL de Inscripción (opcional)</label>
                            <input
                                type="url"
                                name="url_inscripcion"
                                value={formData.url_inscripcion}
                                onChange={handleInputChange}
                                placeholder="https://ejemplo.com/inscripcion"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                {editingEvent ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="events-grid">
                {events.length === 0 ? (
                    <div className="empty-state">
                        No hay eventos registrados
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.$id} className="event-card">
                            <div className="event-header">
                                <h3>{event.title}</h3>
                                <div className="event-actions">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="btn-icon btn-edit"
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.$id)}
                                        className="btn-icon btn-delete"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <p className="event-date">📅 {formatDate(event.date)}</p>
                            <p className="event-description">{event.description}</p>
                            {event.url_inscripcion && (
                                <a
                                    href={event.url_inscripcion}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="event-link"
                                >
                                    🔗 Ver inscripción
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventsManager;

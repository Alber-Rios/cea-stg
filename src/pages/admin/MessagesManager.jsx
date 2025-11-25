import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, MESSAGES_COLLECTION_ID } from '../../config/appwriteConfig';
import '../../styles/Admin.css';
import '../../styles/Messages.css';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID
            );
            // Ordenar por fecha más reciente primero
            const sortedMessages = response.documents.sort((a, b) =>
                new Date(b.fecha) - new Date(a.fecha)
            );
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            setError('Error al cargar los mensajes');
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (messageId, currentStatus) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                messageId,
                { leido: !currentStatus }
            );
            fetchMessages();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            setError('Error al actualizar el mensaje');
        }
    };

    const deleteMessage = async (messageId) => {
        if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) {
            return;
        }

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                messageId
            );
            fetchMessages();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setError('Error al eliminar el mensaje');
        }
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

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.leido;
        if (filter === 'read') return msg.leido;
        return true;
    });

    const unreadCount = messages.filter(msg => !msg.leido).length;

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="manager-container">
            <div className="manager-header">
                <h1>💬 Mensajes de Contacto</h1>
                <div className="filter-buttons">
                    <button
                        onClick={() => setFilter('all')}
                        className={`btn-filter ${filter === 'all' ? 'active' : ''}`}
                    >
                        Todos ({messages.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`btn-filter ${filter === 'unread' ? 'active' : ''}`}
                    >
                        No leídos ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`btn-filter ${filter === 'read' ? 'active' : ''}`}
                    >
                        Leídos ({messages.length - unreadCount})
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="messages-grid">
                {filteredMessages.length === 0 ? (
                    <div className="empty-state">
                        No hay mensajes {filter === 'unread' ? 'sin leer' : filter === 'read' ? 'leídos' : ''}
                    </div>
                ) : (
                    filteredMessages.map((message) => (
                        <div
                            key={message.$id}
                            className={`message-card ${!message.leido ? 'unread' : ''}`}
                        >
                            <div className="message-header">
                                <div className="message-info">
                                    <h3>{message.nombre}</h3>
                                    <p className="message-email">📧 {message.email}</p>
                                    <p className="message-date">📅 {formatDate(message.fecha)}</p>
                                </div>
                                <div className="message-actions">
                                    <button
                                        onClick={() => toggleReadStatus(message.$id, message.leido)}
                                        className={`btn-icon ${message.leido ? 'btn-mark-unread' : 'btn-mark-read'}`}
                                        title={message.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                                    >
                                        {message.leido ? '📭' : '📬'}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(message.$id)}
                                        className="btn-icon btn-delete"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="message-content">
                                <p>{message.mensaje}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesManager;

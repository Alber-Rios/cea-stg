import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, RECYCLING_COLLECTION_ID } from '../../config/appwriteConfig';
import { ID, Query } from 'appwrite';
import '../../styles/Admin.css';

const RecyclingPointsManager = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPoint, setEditingPoint] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        lon: '',
        schedule: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                RECYCLING_COLLECTION_ID
            );
            setPoints(response.documents);
        } catch (error) {
            console.error('Error al cargar puntos:', error);
            setError('Error al cargar los puntos de reciclaje');
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
            const data = {
                name: formData.name,
                address: formData.address,
                lat: parseFloat(formData.lat),
                lon: parseFloat(formData.lon),
                schedule: formData.schedule
            };

            if (editingPoint) {
                await databases.updateDocument(
                    DATABASE_ID,
                    RECYCLING_COLLECTION_ID,
                    editingPoint.$id,
                    data
                );
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    RECYCLING_COLLECTION_ID,
                    ID.unique(),
                    data
                );
            }

            resetForm();
            fetchPoints();
        } catch (error) {
            console.error('Error al guardar:', error);
            setError('Error al guardar el punto de reciclaje');
        }
    };

    const handleEdit = (point) => {
        setEditingPoint(point);
        setFormData({
            name: point.name,
            address: point.address,
            lat: point.lat.toString(),
            lon: point.lon.toString(),
            schedule: point.schedule
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este punto de reciclaje?')) {
            return;
        }

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                RECYCLING_COLLECTION_ID,
                id
            );
            fetchPoints();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setError('Error al eliminar el punto de reciclaje');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            lat: '',
            lon: '',
            schedule: ''
        });
        setEditingPoint(null);
        setShowForm(false);
        setError('');
    };

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="manager-container">
            <div className="manager-header">
                <h1>♻️ Puntos de Reciclaje</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Punto'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="form-card">
                    <h2>{editingPoint ? 'Editar Punto' : 'Nuevo Punto de Reciclaje'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Punto Verde Centro"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Horario *</label>
                                <input
                                    type="text"
                                    name="schedule"
                                    value={formData.schedule}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Lun-Vie 9:00-18:00"
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Dirección *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Ej: Av. Principal 123"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Latitud *</label>
                                <input
                                    type="number"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleInputChange}
                                    placeholder="-34.6037"
                                    step="any"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Longitud *</label>
                                <input
                                    type="number"
                                    name="lon"
                                    value={formData.lon}
                                    onChange={handleInputChange}
                                    placeholder="-58.3816"
                                    step="any"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                {editingPoint ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Coordenadas</th>
                            <th>Horario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No hay puntos de reciclaje registrados
                                </td>
                            </tr>
                        ) : (
                            points.map((point) => (
                                <tr key={point.$id}>
                                    <td>{point.name}</td>
                                    <td>{point.address}</td>
                                    <td className="coordinates">
                                        {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                                    </td>
                                    <td>{point.schedule}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleEdit(point)}
                                            className="btn-icon btn-edit"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(point.$id)}
                                            className="btn-icon btn-delete"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecyclingPointsManager;

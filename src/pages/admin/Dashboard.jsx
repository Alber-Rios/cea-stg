import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { databases, DATABASE_ID, RECYCLING_COLLECTION_ID, EVENTS_COLLECTION_ID } from '../../config/appwriteConfig';
import '../../styles/Admin.css';
import DataMigration from '../../components/admin/DataMigration';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        points: 0,
        events: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const points = await databases.listDocuments(DATABASE_ID, RECYCLING_COLLECTION_ID);
                const events = await databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID);
                setStats({
                    points: points.total,
                    events: events.total
                });
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Bienvenido, {user?.name || 'Admin'}</h1>
                <p>Panel de Control del Centro de Educación Ambiental</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">♻️</div>
                    <div className="stat-info">
                        <h3>Puntos de Reciclaje</h3>
                        <p className="stat-value">{stats.points}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <h3>Eventos Activos</h3>
                        <p className="stat-value">{stats.events}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                        <h3>Administrador</h3>
                        <p className="stat-value">{user?.name || 'Admin'}</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="actions-grid">
                    <div className="action-section">
                        <span className="action-icon">♻️</span>
                        <h3>Gestionar Puntos</h3>
                        <Link to="/admin/recycling-points" className="action-button">
                            Administrar puntos de reciclaje
                        </Link>
                    </div>
                    <div className="action-section">
                        <span className="action-icon">📅</span>
                        <h3>Gestionar Eventos</h3>
                        <Link to="/admin/events" className="action-button">
                            Crear y editar eventos
                        </Link>
                    </div>
                </div>
            </div>

            <DataMigration />
        </div>
    );
};

export default Dashboard;

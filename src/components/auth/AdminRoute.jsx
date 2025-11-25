import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si está autenticado pero no es admin, redirigir a página de acceso denegado
    if (userRole !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si es admin, mostrar el contenido
    return children;
};

export default AdminRoute;

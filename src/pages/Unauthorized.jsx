import { Link } from 'react-router-dom';
import '../styles/Admin.css';

const Unauthorized = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>🚫 Acceso Denegado</h1>
                    <p>No tienes permisos para acceder a esta página</p>
                </div>

                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        Solo los administradores pueden acceder al panel de administración.
                    </p>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '30px' }}>
                        Si crees que deberías tener acceso, contacta al administrador del sistema.
                    </p>

                    <Link to="/" className="btn-primary">
                        🏠 Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;

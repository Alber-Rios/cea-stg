import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Admin.css';
import '../../styles/AdminFixes.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        navigate('/');
        await logout();
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/recycling-points', label: 'Puntos de Reciclaje', icon: '♻️' },
        { path: '/admin/events', label: 'Eventos', icon: '📅' }
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🌱 CEA Admin</h2>
                    <p className="user-email">{user?.email}</p>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="btn-view-site">
                        🌐 Ver Sitio Público
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

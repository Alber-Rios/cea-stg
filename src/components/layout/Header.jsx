import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import styles from './Header.module.css';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, userRole } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            closeMenu();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aún así redirigir a home
            navigate('/');
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>CEA</Link>
                <FaBars className={styles.menuToggle} id="menuToggle" onClick={toggleMenu} />
                <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`} id="navLinks">
                    <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
                    <li><Link to="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
                    <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>
                    {user ? (
                        <>
                            <li className={styles.userInfo}>
                                <FaUser /> {user.name}
                            </li>
                            {userRole === 'admin' && (
                                <li>
                                    <Link to="/admin/dashboard" onClick={closeMenu} className={styles.adminLink}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    <FaSignOutAlt /> Cerrar Sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                    )}
                    <li className={styles.themeToggleItem}>
                        <ThemeToggle />
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;

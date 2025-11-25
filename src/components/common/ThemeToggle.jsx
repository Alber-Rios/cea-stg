import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './ThemeToggle.module.css';

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            <div className={`${styles.toggleTrack} ${isDarkMode ? styles.dark : ''}`}>
                <div className={styles.toggleThumb}>
                    {isDarkMode ? <FaMoon className={styles.icon} /> : <FaSun className={styles.icon} />}
                </div>
            </div>
        </button>
    );
}

export default ThemeToggle;

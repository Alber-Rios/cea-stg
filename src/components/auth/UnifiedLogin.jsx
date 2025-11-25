import { useTheme } from '../../hooks/useTheme';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import styles from './UnifiedLogin.module.css';

function UnifiedLogin() {
    const { isDarkMode } = useTheme();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle, register, user, userRole, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirigir si ya hay sesión activa
    useEffect(() => {
        if (user && userRole) {
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, userRole, navigate]);

    if (authLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando sesión...</div>;
    }

    const validateForm = () => {
        // Validación de email estricta
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return false;
        }

        // Bloquear dominios con errores tipográficos comunes
        const domain = email.split('@')[1]?.toLowerCase();
        const blockedDomains = ['gamil.com', 'hotmial.com', 'yaho.com', 'outlok.com'];
        if (blockedDomains.includes(domain)) {
            setError(`Parece que hay un error en el dominio. ¿Quisiste decir ${domain.replace('gamil', 'gmail').replace('hotmial', 'hotmail').replace('yaho', 'yahoo').replace('outlok', 'outlook')}?`);
            return false;
        }

        // Validación de nombre (solo si es registro)
        if (isRegister) {
            if (name.trim().length < 3) {
                setError('El nombre debe tener al menos 3 caracteres.');
                return false;
            }
            // Opcional: Solo letras y espacios
            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!nameRegex.test(name)) {
                setError('El nombre solo puede contener letras y espacios.');
                return false;
            }
        }

        // Validación de contraseña
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return false;
        }

        // Validación de similitud Nombre vs Email (Solo registro)
        if (isRegister) {
            const emailUser = email.split('@')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const nameParts = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');

            // Filtramos palabras cortas (de, la, el) para evitar falsos positivos
            const significantNameParts = nameParts.filter(part => part.length >= 3);

            // Si el nombre es muy corto, usamos las partes tal cual
            const partsToCheck = significantNameParts.length > 0 ? significantNameParts : nameParts;

            const isSimilar = partsToCheck.some(part => emailUser.includes(part));

            if (!isSimilar) {
                setError('Por seguridad, el correo electrónico debe tener relación con tu nombre registrado.');
                return false;
            }
        }

        return true;
    };

    const translateError = (errorMsg) => {
        if (errorMsg.includes('Invalid credentials')) {
            return 'Credenciales inválidas. Por favor, verifica el correo y la contraseña.';
        }
        if (errorMsg.includes('User with the same email already exists')) {
            return 'Ya existe un usuario registrado con este correo electrónico.';
        }
        if (errorMsg.includes('Rate limit exceeded')) {
            return 'Has excedido el límite de intentos. Por favor, inténtalo más tarde.';
        }
        return errorMsg;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isRegister) {
                const result = await register(email, password, name);
                if (result.success) {
                    navigate('/');
                } else {
                    setError(translateError(result.error));
                }
            } else {
                const result = await login(email, password);
                if (result.success) {
                    // Redirigir según rol
                    if (result.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    setError(translateError(result.error));
                }
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        loginWithGoogle();
    };



    return (
        <div className={`${styles.loginPage} ${isDarkMode ? styles.dark : ''}`}>
            {/* Fireflies */}
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>
            <div className={styles.firefly}></div>

            <div className={styles.loginContainer}>
                <form
                    className={styles.loginForm}
                    onSubmit={handleSubmit}
                >
                    <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
                    {isRegister && (
                        <p className={styles.subtitle}>
                            Regístrate para acceder a todos los recursos
                        </p>
                    )}

                    {isRegister && (
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <FaUser className={styles.inputIcon} />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaEnvelope className={styles.inputIcon} />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                        <FaLock className={styles.inputIcon} />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión')}
                    </button>

                    <div className={styles.divider}>
                        <span>o continúa con</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className={styles.googleBtn}
                        disabled={loading}
                    >
                        <FcGoogle className={styles.googleIcon} />
                        Google
                    </button>

                    <p className={styles.toggle}>
                        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        <button
                            type="button"
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            className={styles.toggleBtn}
                        >
                            {isRegister ? 'Inicia sesión' : 'Regístrate'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default UnifiedLogin;

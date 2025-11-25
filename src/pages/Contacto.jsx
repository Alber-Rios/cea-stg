import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { databases, DATABASE_ID, MESSAGES_COLLECTION_ID } from '../config/appwriteConfig';
import { ID } from 'appwrite';
import styles from './Contacto.module.css';

function Contacto() {
    useScrollAnimation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Auto-completar nombre y email si el usuario está logueado
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si el usuario no está logueado, mostrar prompt para login
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        setSending(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Guardar mensaje en Appwrite
            await databases.createDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                ID.unique(),
                {
                    nombre: formData.nombre,
                    email: formData.email,
                    mensaje: formData.mensaje,
                    userId: user.$id,
                    fecha: new Date().toISOString(),
                    leido: false
                }
            );

            setSuccessMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.');
            setFormData({ nombre: user.name || '', email: user.email || '', mensaje: '' });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setErrorMessage('Error al enviar el mensaje. Por favor, intenta de nuevo.');
        } finally {
            setSending(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className={styles.contacto}>
            <section className="sub-header header-contacto">
                <h1>Contáctanos</h1>
            </section>

            <section className={`${styles.contentSection} events-section`} style={{ marginTop: 0 }}>
                <h2 className="section-title">Envíanos un Mensaje</h2>

                <div className={styles.contactContainer}>
                    <div className={styles.contactInfo}>
                        <h3>Información de Contacto</h3>
                        <p>📍 <strong>Dirección:</strong><br />Av. Beauchef 1327, Santiago</p>
                        <p>📞 <strong>Teléfono:</strong><br />(2) 2827 1299</p>
                        <p>📧 <strong>Email:</strong><br />contacto@cea-santiago.cl</p>
                        <p>🕒 <strong>Horario:</strong><br />Lunes a Viernes: 9:00 - 18:00</p>
                    </div>

                    <form className={styles.contactForm} onSubmit={handleSubmit}>
                        {successMessage && (
                            <div className={styles.successMessage}>
                                ✅ {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                ❌ {errorMessage}
                            </div>
                        )}

                        {showLoginPrompt && (
                            <div className={styles.loginPrompt}>
                                <p>⚠️ Debes iniciar sesión para enviar un mensaje</p>
                                <button
                                    type="button"
                                    onClick={handleLoginRedirect}
                                    className={styles.loginBtn}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPrompt(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={!!user}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!!user}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows="5"
                                value={formData.mensaje}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={sending}>
                            {sending ? 'Enviando...' : 'Enviar Mensaje'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Contacto;

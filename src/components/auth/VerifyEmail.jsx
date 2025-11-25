import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { account } from '../config/appwriteConfig';
import styles from './UnifiedLogin.module.css'; // Reusing login styles for consistency

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verificando tu correo electrónico...');

    useEffect(() => {
        const verify = async () => {
            const userId = searchParams.get('userId');
            const secret = searchParams.get('secret');

            if (!userId || !secret) {
                setStatus('error');
                setMessage('Enlace de verificación inválido.');
                return;
            }

            try {
                await account.updateVerification(userId, secret);
                setStatus('success');
                setMessage('¡Correo verificado exitosamente! Ahora puedes iniciar sesión.');
            } catch (error) {
                console.error('Error de verificación:', error);
                setStatus('error');
                setMessage('No se pudo verificar el correo. El enlace puede haber expirado.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <div className={styles.loginForm} style={{ textAlign: 'center' }}>
                    <h2>Verificación de Correo</h2>

                    <div style={{ margin: '30px 0', fontSize: '1.2rem' }}>
                        {status === 'verifying' && <p>⏳ {message}</p>}
                        {status === 'success' && <p style={{ color: 'var(--primary-green)' }}>✅ {message}</p>}
                        {status === 'error' && <p style={{ color: '#c33' }}>❌ {message}</p>}
                    </div>

                    {status !== 'verifying' && (
                        <button
                            onClick={() => navigate('/login')}
                            className={styles.submitBtn}
                        >
                            Ir a Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;

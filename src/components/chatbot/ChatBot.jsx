import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { monthNames } from '../../data/events';
import { getAIResponse } from '../../services/ai';
import { useCalendar } from '../../hooks/useCalendar';
import styles from './ChatBot.module.css';

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showTyping, setShowTyping] = useState(false);
    const chatBodyRef = useRef(null);
    const lastMessageRef = useRef(null);
    const { events } = useCalendar();

    const MENU_OPTIONS = [
        "♻️ Qué Recibimos",
        "📅 Próximos Eventos",
        "🕒 Horarios",
        "📍 Dirección CEA"
    ];

    const getEventosFromAppwrite = () => {
        const listaEventos = [];

        // Convert Appwrite events format to chatbot format
        Object.keys(events).forEach(key => {
            const [day, month, year] = key.split('-').map(Number);
            // month ya es un índice (0-11), no necesita ajuste
            const fechaEvento = new Date(year, month, day);

            events[key].forEach(event => {
                listaEventos.push({
                    fechaRaw: fechaEvento,
                    fechaLegible: `${day} de ${monthNames[month]}`,
                    titulo: event.title,
                    descripcion: event.info,
                    link: null // Appwrite events don't have links in current schema
                });
            });
        });

        return listaEventos.sort((a, b) => a.fechaRaw - b.fechaRaw);
    };

    const findResponse = (input) => {
        const text = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        // Saludos
        if (["hola", "buenos dias", "buenas tardes", "hi", "hello"].some(k => text.includes(k))) {
            return `<p>¡Hola! 😊 Qué gusto saludarte. Estoy listo para ayudarte.</p>` +
                `<p>¿Buscas información sobre <strong>qué reciclar</strong> o <strong>dónde están los puntos limpios</strong>?</p>`;
        }
        // Gracias / Despedida
        if (["gracias", "chao", "adios", "hasta luego"].some(k => text.includes(k))) {
            return `<p>¡De nada! 🌿 Estamos para educar y construir un futuro más verde.</p>` +
                `<p>Si necesitas algo más, aquí estaré. ¡Que tengas un gran día!</p>`;
        }
        // Qué Recibimos
        if (input === "♻️ Qué Recibimos" || ["materiales", "acepta", "recibe", "plastico", "carton", "vidrio", "reciclaje"].some(k => text.includes(k))) {
            return `<div class="${styles.chatInfoCard}">`
                + `<div class="${styles.chatCardHeader}">♻️ ¿Qué recibimos en CEA?</div>`
                + `<div class="${styles.chatCardBody}">`
                + `<p>Recuerda traer tus residuos <strong>limpios, secos y aplastados</strong>:</p>`
                + `<ul>`
                + `<li>🟦 <strong>Papeles y cartones:</strong> Cajas, diarios, revistas, papel blanco.</li>`
                + `<li>🟨 <strong>Plásticos y Latas:</strong> Botellas PET 1 (bebidas) y latas de aluminio.</li>`
                + `<li>🟩 <strong>Vidrio:</strong> Botellas y frascos (sin tapas).</li>`
                + `</ul>`
                + `</div></div>`;
        }

        // Eventos
        if (input === "📅 Próximos Eventos" || ["taller", "curso", "charla", "evento", "actividad", "agenda"].some(k => text.includes(k))) {
            const eventos = getEventosFromAppwrite();
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const eventosFuturos = eventos.filter(ev => ev.fechaRaw >= hoy);
            if (eventosFuturos.length > 0) {
                let html = `<p>📅 <strong>Próximas actividades confirmadas:</strong></p>`;
                eventosFuturos.forEach(ev => {
                    html += `<div class="${styles.chatEventCard}">`
                        + `<div class="${styles.chatCardHeader}">📅 ${ev.fechaLegible}</div>`
                        + `<div class="${styles.chatCardBody}">`
                        + `<div class="${styles.chatEventTitle}">${ev.titulo}</div>`
                        + `<div class="${styles.chatEventDesc}">📍 ${ev.descripcion}</div>`
                        + (ev.link ? `<a href="${ev.link}" target="_blank" class="${styles.btnInscripcion}">Más info / Inscribirse</a>` : '')
                        + `</div></div>`;
                });
                return html;
            }
            return `<p>📅 No hay eventos próximos en calendario. ¡Atento a nuestras redes!</p>`;
        }
        // Horarios
        if (input === "🕒 Horarios" || ["horario", "hora", "abre", "cierra", "atencion"].some(k => text.includes(k))) {
            return `<div class="${styles.chatInfoCard}">`
                + `<div class="${styles.chatCardHeader}">🕒 Horarios de Atención</div>`
                + `<div class="${styles.chatCardBody}"><ul>`
                + `<li>🟢 <strong>Lunes a Viernes:</strong><br/>09:00 - 18:00 hrs.</li>`
                + `<li>🔴 <strong>Sábados y Domingos:</strong><br/>Cerrado.</li>`
                + `</ul></div></div>`;
        }
        // Dirección
        if (input === "📍 Dirección CEA" || ["direccion", "llegar", "calle", "metro"].some(k => text.includes(k))) {
            return `<div class="${styles.chatInfoCard}">`
                + `<div class="${styles.chatCardHeader}">📍 ¿Cómo llegar al CEA?</div>`
                + `<div class="${styles.chatCardBody}">`
                + `<div class="${styles.chatEventTitle}">Av. Beauchef 1327, Santiago</div>`
                + `<p>Interior Parque O'Higgins.</p>`
                + `<p>🚇 <strong>Metro cercano:</strong><br/>Estación Parque O'Higgins (Línea 2).</p>`
                + `<a href="https://maps.google.com" target="_blank" class="${styles.chatLink}">🗺️ Ver en Google Maps</a>`
                + `</div></div>`;
        }

        // Default: Return null to trigger AI fallback
        return null;
    };

    const addMessage = (text, sender, showMenu = false) => {
        setMessages(prev => [...prev, { text, sender, showMenu }]);
    };

    const handleSend = async (text = null) => {
        const msg = text || inputValue.trim();
        if (!msg) return;

        // Mostrar mensaje del usuario inmediatamente si no es opción de menú
        if (!text) {
            addMessage(msg, 'user');
            setInputValue('');
        }

        setShowTyping(true);

        // Simular pequeño delay para "pensar"
        setTimeout(async () => {
            // 1. Intentar respuesta local
            let response = findResponse(msg);

            // 2. Si no hay respuesta local, usar IA
            if (!response) {
                try {
                    response = await getAIResponse(msg);
                } catch (error) {
                    response = "Lo siento, tuve un error al conectar con mi cerebro digital.";
                }
            }

            setShowTyping(false);
            addMessage(response, 'bot', true);
        }, 600);
    };

    const handleOpen = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            setTimeout(() => {
                addMessage('¡Hola! 👋 Soy el asistente virtual de CEA. ¿En qué puedo ayudarte hoy?', 'bot', true);
            }, 500);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Smooth scroll to the newest message
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages]);

    return (
        <>
            <div className={styles.floatingChat} onClick={handleOpen}>
                <FaComments />
            </div>
            <div className={`${styles.chatWindow} ${isOpen ? styles.active : ''}`}>
                <div className={styles.chatHeader}>
                    <h3>Asistente CEA</h3>
                    <button onClick={handleClose}><FaTimes /></button>
                </div>
                <div className={styles.chatBody} ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                            <div className={`${styles.message} ${msg.sender === 'bot' ? styles.botMessage : styles.userMessage}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                            {msg.sender === 'bot' && msg.showMenu && (
                                <div className={styles.chatOptions}>
                                    {MENU_OPTIONS.map((option, idx) => (
                                        <button key={idx} className={styles.chatOptionBtn} onClick={() => handleSend(option)}>{option}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {showTyping && (
                        <div className={`${styles.message} ${styles.botMessage} ${styles.typingIndicator}`}>
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    )}
                </div>
                <div className={styles.chatFooter}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe tu mensaje..."
                    />
                    <button onClick={() => handleSend()}><FaPaperPlane /></button>
                </div>
            </div>
        </>
    );
}

export default ChatBot;

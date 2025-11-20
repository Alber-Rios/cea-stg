document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chatWindow');
    const floatingBtn = document.querySelector('.floating-chat');
    const closeBtn = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBody = document.getElementById('chatBody');

    if (!chatWindow || !floatingBtn || !closeBtn || !sendBtn || !userInput || !chatBody) return;

    // =================================================================
    // 🧠 CEREBRO DEL BOT (ACTUALIZADO Y CORREGIDO)
    // =================================================================
    const CONOCIMIENTO_BOT = {
        
        // --- 1. HABILIDADES SOCIALES ---
        "👋 Saludos": {
            keywords: ["hola", "buenos dias", "buenas tardes", "buenas", "oli", "alo", "hello", "hi", "que tal"],
            respuesta: `
                <p>¡Hola! 😊 Qué gusto saludarte. Estoy listo para ayudarte.</p>
                <p>¿Buscas información sobre <strong>qué reciclar</strong> o <strong>dónde están los puntos limpios</strong>?</p>`
        },
        "🤝 Cortesía/Despedida": {
            keywords: ["gracias", "te pasaste", "chao", "adios", "hasta luego", "ok", "listo", "vale", "muchas gracias"],
            respuesta: `
                <p>¡De nada! 🌿 Estamos para educar y construir un futuro más verde.</p>
                <p>Si necesitas algo más, aquí estaré. ¡Que tengas un gran día!</p>`
        },
        "😡 Insultos/Quejas": {
            keywords: ["tonto", "inutil", "no sirves", "malo", "idiota"],
            respuesta: `<p>😅 Lamento si no pude ayudarte. Soy un bot en aprendizaje. Por favor intenta elegir una opción del menú.</p>`
        },

        // --- 2. INFORMACIÓN DIVIDIDA DE RECICLAJE ---
        
        // A. QUÉ RECIBIMOS (MATERIALES) - CON HTML CORREGIDO
        "♻️ Qué Recibimos": {
            keywords: ["que", "materiales", "acepta", "recibe", "tipo", "basura", "plastico", "carton", "vidrio", "residuos", "traer", "reciclaje"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">♻️ ¿Qué recibimos en CEA?</div>
                    <div class="chat-card-body">
                        <p>Recuerda traer tus residuos <strong>limpios, secos y aplastados</strong>:</p>
                        <ul>
                            <li>
                                <span class="li-icon">🟦</span>
                                <div class="li-content">
                                    <strong>Papeles y cartones:</strong>
                                    <span>Cajas, diarios, revistas, papel blanco.</span>
                                </div>
                            </li>
                            <li>
                                <span class="li-icon">🟨</span>
                                <div class="li-content">
                                    <strong>Plásticos y Latas:</strong>
                                    <span>Botellas PET 1 (bebidas) y latas de aluminio.</span>
                                </div>
                            </li>
                            <li>
                                <span class="li-icon">🟩</span>
                                <div class="li-content">
                                    <strong>Vidrio:</strong>
                                    <span>Botellas y frascos (sin tapas).</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>`
        },

        // B. DÓNDE RECICLAR (UBICACIÓN Y MAPA)
        "🗺️ Puntos de Reciclaje": {
            keywords: ["donde", "mapa", "puntos", "lugares", "ubicacion", "direccion", "dejar", "llevo"], 
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">🗺️ Red de Puntos Limpios</div>
                    <div class="chat-card-body">
                        <p>Además del CEA, existen varios puntos en la comuna.</p>
                        <p>Puedes revisar el mapa interactivo para encontrar el más cercano a tu hogar.</p>
                        <a href="/html/Proyectos.html#seccion-mapa" class="btn-inscripcion">📍 Ver Mapa de Puntos</a>
                    </div>
                </div>`
        },

        // --- 3. OTRAS SECCIONES ---
        "📅 Próximos Eventos": { 
            keywords: ["taller", "curso", "charla", "caminata", "evento", "actividad", "agenda", "cuando", "fecha"],
            tipo: "dinamico_eventos" 
        },
        "🕒 Horarios": {
            keywords: ["horario", "hora", "abre", "cierra", "atencion", "dias", "abierto"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">🕒 Horarios de Atención</div>
                    <div class="chat-card-body">
                        <ul>
                            <li>🟢 <strong>Lunes a Viernes:</strong><br>09:00 - 18:00 hrs.</li>
                            <li>🔴 <strong>Sábados y Domingos:</strong><br>Cerrado.</li>
                        </ul>
                    </div>
                </div>`
        },
        "📍 Dirección CEA": {
            keywords: ["ubicaci", "llegar", "calle", "metro"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">📍 ¿Cómo llegar al CEA?</div>
                    <div class="chat-card-body">
                        <div class="chat-event-title">Av. Beauchef 1327, Santiago</div>
                        <p>Interior Parque O'Higgins.</p>
                        <p>🚇 <strong>Metro cercano:</strong><br>Estación Parque O'Higgins (Línea 2).</p>
                        <a href="https://maps.google.com" target="_blank" class="chat-link">🗺️ Ver en Google Maps</a>
                    </div>
                </div>`
        },
        "👥 Quiénes Somos": {
            keywords: ["quien", "somos", "hacen", "mision", "nosotros", "cea", "historia"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">👥 Sobre Nosotros</div>
                    <div class="chat-card-body">
                        <div class="chat-event-title">Centro Educativo Ambiental</div>
                        <p>Somos una iniciativa municipal ubicada en el corazón del Parque O'Higgins.</p>
                        <p>Nuestra misión es fomentar la conciencia ecológica y la biodiversidad urbana.</p>
                        <a href="/html/Nosotros.html" class="chat-link">Leer nuestra Historia</a>
                    </div>
                </div>`
        },
        "📚 Recursos/Videos": {
            keywords: ["video", "tutorial", "aprender", "guia", "manual", "pdf", "recurso", "educativo", "clase"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">📚 Recursos Educativos</div>
                    <div class="chat-card-body">
                        <p>¡Sí! Contamos con material didáctico gratuito para ti.</p>
                        <p>Puedes ver nuestros talleres grabados o descargar guías prácticas.</p>
                        <a href="/html/videos.html" class="btn-inscripcion">🎬 Ver Video Talleres</a>
                        <a href="/html/Recursos.html" class="chat-link" style="margin-top:8px;">📖 Ir a Biblioteca Digital</a>
                    </div>
                </div>`
        },
        "🌱 Proyectos": {
            keywords: ["proyecto", "huerto", "reforestacion", "iniciativa", "programa"],
            respuesta: `
                <div class="chat-info-card">
                    <div class="chat-card-header">🌱 Nuestros Proyectos</div>
                    <div class="chat-card-body">
                        <p>Trabajamos en varias líneas de acción:</p>
                        <ul>
                            <li>🏙️ <strong>Santiago Recicla</strong></li>
                            <li>🥕 <strong>Huertos Urbanos</strong></li>
                            <li>🌳 <strong>Reforestación Nativa</strong></li>
                        </ul>
                        <a href="/html/Proyectos.html" class="chat-link">Ver detalles</a>
                    </div>
                </div>`
        }
    };

    // MENSAJE DE ERROR
    const RESPUESTA_DEFAULT = `
        <p>😕 Disculpa, no entendí bien esa pregunta.</p>
        <p>Intenta con palabras clave como <em>"Horarios", "Eventos" o "Reciclaje"</em>.</p>
        <p>O contáctanos directamente:</p>
        <ul class="contact-list">
            <li>📞 +56 2 2827 1299</li>
            <li>📧 contacto@cea-santiago.cl</li>
        </ul>
    `;
    
    // --- MENÚ AUTOMÁTICO ACTUALIZADO ---
    const MENU_AUTOMATICO = [
        "♻️ Qué Recibimos", 
        "🗺️ Puntos de Reciclaje", 
        "📅 Próximos Eventos", 
        "🕒 Horarios", 
        "📍 Dirección CEA"
    ];

    // =================================================================
    // 💾 MEMORIA
    // =================================================================
    function guardarMensaje(text, sender) {
        let historial = JSON.parse(sessionStorage.getItem('chatHistorial')) || [];
        historial.push({ text, sender });
        sessionStorage.setItem('chatHistorial', JSON.stringify(historial));
    }

    // =================================================================
    // ⚙️ LÓGICA INTELIGENTE
    // =================================================================

    function encontrarRespuesta(input) {
        const text = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let keyEncontrada = null;

        if (CONOCIMIENTO_BOT[input]) {
            keyEncontrada = input;
        } else {
            for (let key in CONOCIMIENTO_BOT) {
                if (CONOCIMIENTO_BOT[key].keywords.some(k => text.includes(k))) {
                    keyEncontrada = key;
                    break;
                }
            }
        }

        if (keyEncontrada) {
            const info = CONOCIMIENTO_BOT[keyEncontrada];

            if (info.tipo === "dinamico_eventos") {
                if (typeof window.obtenerTodosLosEventos === 'function') {
                    const todosLosEventos = window.obtenerTodosLosEventos();
                    const hoy = new Date();
                    hoy.setHours(0,0,0,0);
                    
                    const eventosFuturos = todosLosEventos.filter(ev => ev.fechaRaw >= hoy);

                    if (eventosFuturos.length > 0) {
                        let html = '<p>📅 <strong>Próximas actividades confirmadas:</strong></p>';
                        html += eventosFuturos.slice(0, 3).map(ev => `
                            <div class="chat-event-card">
                                <div class="chat-card-header">
                                    📅 ${ev.fechaLegible}
                                </div>
                                <div class="chat-card-body">
                                    <div class="chat-event-title">${ev.titulo}</div>
                                    <div class="chat-event-desc">📍 ${ev.descripcion}</div>
                                    ${ev.link ? `<a href="${ev.link}" target="_blank" class="btn-inscripcion">Más info / Inscribirse</a>` : ''}
                                </div>
                            </div>
                        `).join('');
                        return html;
                    } else {
                        return "<p>📅 No hay eventos próximos en calendario. ¡Atento a nuestras redes!</p>";
                    }
                } else {
                    return "<p>⚠️ Error técnico: No pude leer el calendario.</p>";
                }
            }
            return info.respuesta;
        }
        return RESPUESTA_DEFAULT;
    }

    // =================================================================
    // 🎨 UI Y SCROLL
    // =================================================================

    function addMessage(text, sender, showMenu = false, save = true) {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
        messageDiv.innerHTML = text;
        chatBody.appendChild(messageDiv);

        if (save) guardarMensaje(text, sender);

        setTimeout(() => {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);

        if (sender === 'bot' && showMenu) {
            mostrarMenuOpciones();
        }
    }

    function mostrarTyping() {
        const div = document.createElement('div');
        div.className = 'message bot-message typing-indicator';
        div.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend(text = null) {
        const msg = text || userInput.value.trim();
        if (!msg) return;

        addMessage(msg, 'user', false, true);
        userInput.value = '';

        mostrarTyping();

        setTimeout(() => {
            const respuesta = encontrarRespuesta(msg);
            addMessage(respuesta, 'bot', true, true);
        }, 600); 
    }

    function mostrarMenuOpciones() {
        const oldMenu = document.querySelector('.chat-options');
        if (oldMenu) oldMenu.remove();

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        
        MENU_AUTOMATICO.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = option;
            btn.onclick = () => handleSend(option);
            optionsDiv.appendChild(btn);
        });
        chatBody.appendChild(optionsDiv);
    }

    // =================================================================
    // 🛠️ CONTROLES
    // =================================================================
    
    floatingBtn.addEventListener('click', () => {
        chatWindow.classList.add('active');
        if (chatBody.children.length === 0) {
            setTimeout(() => {
                addMessage("¡Hola! 👋 Soy el asistente virtual de CEA. ¿En qué puedo ayudarte hoy?", 'bot', true, true);
            }, 500);
        }
    });
    
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        sessionStorage.removeItem('chatHistorial'); 
        chatBody.innerHTML = ''; 
    });

    sendBtn.addEventListener('click', () => handleSend());
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    function iniciarChat() {
        const historial = JSON.parse(sessionStorage.getItem('chatHistorial')) || [];
        if (historial.length > 0) {
            historial.forEach(msg => {
                addMessage(msg.text, msg.sender, false, false); 
            });
            if (historial[historial.length - 1].sender === 'bot') {
                mostrarMenuOpciones();
            }
        }
    }

    iniciarChat();
});
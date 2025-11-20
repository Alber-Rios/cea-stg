// js/script.js
import { databases } from './appwrite.js';

// =========================================
// 1. GESTIÓN DE DATOS (LÓGICA DE FECHAS)
// =========================================
// ✅ NUEVA FUNCIÓN SEGURA: obtiene eventos desde Appwrite
window.obtenerTodosLosEventos = async function() {
    try {
        const response = await databases.listDocuments(
            'CEADB',     // ID de tu base de datos
            'events'    // ID de tu colección
        );

        return response.documents.map(doc => ({
            fechaRaw: new Date(doc.date),
            fechaLegible: new Date(doc.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long'
            }),
            titulo: doc.title,
            descripcion: doc.description,
            link: doc.url_inscripcion || '' // debe existir en tu colección
        })).sort((a, b) => a.fechaRaw - b.fechaRaw);

    } catch (error) {
        console.error('⚠️ Error al cargar eventos:', error);
        return []; // fallback vacío
    }
};

// ✅ RENDERIZADO DINÁMICO (reemplaza renderEventsList)
function renderEventsList() {
    const container = document.querySelector('.events-list');
    if (!container) return;

    window.obtenerTodosLosEventos().then(eventos => {
        if (eventos.length === 0) {
            container.innerHTML = '<p>No hay eventos próximos.</p>';
            return;
        }

        const html = eventos.map(ev => {
            const day = ev.fechaRaw.getDate();
            const month = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][ev.fechaRaw.getMonth()];
            const btn = ev.link 
                ? `<a href="${ev.link}" target="_blank" class="btn-register">Inscribirse</a>`
                : '';
            return `
            <div class="event-item">
                <div class="event-date">
                    <div class="day">${day}</div>
                    <div class="month">${month}</div>
                </div>
                <div class="event-info">
                    <h4>${ev.titulo}</h4>
                    <p>${ev.descripcion}</p>
                    ${btn}
                </div>
            </div>`;
        }).join('');

        container.innerHTML = html;
    });
}

// Llama al render al cargar
document.addEventListener('DOMContentLoaded', renderEventsList);


document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // 0. CONTROL DE SCROLL Y MENÚ HAMBURGUESA
    // =========================================
    window.scrollTo(0, 0); 

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // =========================================
    // 2. RENDERIZADO DEL CALENDARIO (Legacy / Placeholder)
    // =========================================
    // Nota: La lógica del calendario dependía de data.js. 
    // Se mantiene la estructura básica pero no mostrará eventos sin data.js.
    // Si se desea reactivar, se debe adaptar para usar window.obtenerTodosLosEventos()
    
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const calendarWidget = document.querySelector(".calendar-widget");

    function renderCalendar() {
        updateCalendar(currentMonth, currentYear);
    }
    
    function updateCalendar(month, year) {
        if (!calendarWidget) return;

        // Sin data.js, events será vacío
        const events = {}; 
        const now = new Date();
        const today = now.getDate();
        const currentActualMonth = now.getMonth();
        const currentActualYear = now.getFullYear();

        let firstDayIndex = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <button id="prevMonth" title="Mes anterior" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--primary-green);"><i class="fas fa-chevron-left"></i></button>
                <h4 style="margin: 0; color: var(--primary-green);">${monthNames[month]} ${year}</h4>
                <button id="nextMonth" title="Mes siguiente" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--primary-green);"><i class="fas fa-chevron-right"></i></button>
            </div>
            <table class="calendar-table">
                <thead>
                    <tr><th>L</th><th>M</th><th>X</th><th>J</th><th>V</th><th>S</th><th>D</th></tr>
                </thead>
                <tbody><tr>`;

        for (let i = 0; i < adjustedFirstDay; i++) html += "<td></td>";

        let currentDayOfWeek = adjustedFirstDay;

        for (let day = 1; day <= daysInMonth; day++) {
            if (currentDayOfWeek > 6) {
                html += "</tr><tr>";
                currentDayOfWeek = 0;
            }

            const eventKey = `${day}-${month}-${year}`;
            const eventArray = events[eventKey];

            let classList = [];
            if (day === today && month === currentActualMonth && year === currentActualYear) classList.push("active-date");
            if (eventArray) classList.push("has-event");

            const dataAttributes = eventArray
                ? `data-event-title="${eventArray[0].title}" data-event-info="${eventArray[0].info}"`
                : "";

            html += `<td class="${classList.join(" ")}" ${dataAttributes}>${day}</td>`;
            currentDayOfWeek++;
        }

        html += "</tr></tbody></table>";
        html += '<div id="calendar-info-box" class="calendar-info-box" style="display:none;"></div>';

        calendarWidget.innerHTML = html;
        attachCalendarListeners();
    }
    
    function attachCalendarListeners() {
        document.getElementById("prevMonth")?.addEventListener("click", () => changeMonth(-1));
        document.getElementById("nextMonth")?.addEventListener("click", () => changeMonth(1));

        const infoBox = document.getElementById("calendar-info-box");

        document.querySelectorAll(".calendar-table td.has-event").forEach((td) => {
            td.addEventListener("click", function (e) {
                const rect = e.target.getBoundingClientRect();
                infoBox.innerHTML = `<p><strong>${e.target.getAttribute("data-event-title")}</strong></p><p style="margin-top:5px; font-size:0.9em; color:#ddd;">${e.target.getAttribute("data-event-info")}</p>`;
                const widgetRect = calendarWidget.getBoundingClientRect();

                infoBox.style.left = `${rect.left - widgetRect.left + rect.width / 2}px`;
                infoBox.style.top = `${rect.bottom - widgetRect.top + 10}px`;
                infoBox.style.transform = `translateX(-50%)`;
                infoBox.style.display = "block";

                setTimeout(() => { infoBox.style.display = "none"; }, 4000);
            });
        });

        document.addEventListener("click", (e) => {
            if (!calendarWidget?.contains(e.target) && infoBox && !infoBox.contains(e.target)) {
                infoBox.style.display = "none";
            }
        });
    }

    function changeMonth(step) {
        currentMonth += step;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        } else if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentMonth, currentYear);
    }

    // =========================================
    // INICIALIZACIÓN Y ANIMACIONES
    // =========================================

    if (document.querySelector(".calendar-widget")) {
        renderCalendar();
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px",
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('fade-up') || entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('element-visible');
                }
                if (entry.target.classList.contains('events-section') || entry.target.classList.contains('location-section')) {
                    const container = entry.target.querySelector('.leaf-animation-container');
                    if (container && !container.dataset.generated) {
                        generateSideLeaves(container);
                        container.dataset.generated = 'true';
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    document
        .querySelectorAll(".fade-up, .fade-in, .events-section, .location-section")
        .forEach((el) => {
            observer.observe(el);
        });

    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        for (let i = 0; i < 5; i++) {
            let leaf = document.createElement("div");
            leaf.className = "leaf";
            heroSection.appendChild(leaf);
        }
    }

    function generateSideLeaves(container) {
        for (let i = 0; i < 6; i++) {
            let leaf = document.createElement("div");
            leaf.className = "side-leaf";
            leaf.style.top = 10 + Math.random() * 80 + "%";
            if (Math.random() > 0.5) {
                leaf.style.left = "-30px";
                leaf.classList.add("animate-leaf-left");
            } else {
                leaf.style.right = "-30px";
                leaf.classList.add("animate-leaf-right");
            }
            const size = 20 + Math.random() * 15;
            leaf.style.width = `${size}px`;
            leaf.style.height = `${size}px`;
            leaf.style.animationDelay = Math.random() * 2 + "s";
            container.appendChild(leaf);
        }
    }

    // =========================================
    // 3. LÓGICA DEL FORMULARIO DE CONTACTO (Appwrite Function)
    // =========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                // Llamada a la Appwrite Function (Execution)
                const response = await fetch('https://cloud.appwrite.io/v1/functions/submit-contact/executions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Appwrite-Project': '673f9a5d003b4e84c7a8' // Tu Project ID público
                    },
                    body: JSON.stringify({ 
                        body: JSON.stringify({ payload }) 
                    })
                });

                const result = await response.json();

                if (response.ok && result.status === 'completed') {
                    alert('¡Gracias! Hemos recibido tu mensaje correctamente.');
                    contactForm.reset();
                } else {
                    console.error('Error:', result);
                    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
                }
            } catch (error) {
                console.error('Error de red:', error);
                alert('Error de conexión. Verifica tu internet.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
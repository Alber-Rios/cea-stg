// js/map-dinamico.js
import { databases } from './appwrite.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnVerPuntos = document.querySelector('.cards-section .card:nth-child(1) button');
    const seccionMapa = document.getElementById('seccion-mapa');
    let mapaIniciado = false;

    async function cargarPuntos() {
        try {
            const res = await databases.listDocuments('CEADB', 'recycling_points');
            return res.documents.map(doc => ({
                nombre: doc.name,
                direccion: doc.address,
                horario: doc.schedule || 'Sin horario',
                lat: parseFloat(doc.lat),
                lon: parseFloat(doc.lon)
            }));
        } catch (e) {
            console.error('❌ Error al cargar puntos:', e);
            return [];
        }
    }

    async function iniciarMapa() {
        if (mapaIniciado || !seccionMapa) return;

        const map = L.map('mapReciclaje').setView([-33.45, -70.67], 12);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Iconos
        const ceaIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const recIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Sede CEA (fija)
        L.marker([-33.464272, -70.661817], {icon: ceaIcon})
            .addTo(map)
            .bindPopup('<b>🏢 Sede CEA</b><br>Av. Beauchef 1327');

        // Puntos dinámicos
        const puntos = await cargarPuntos();
        puntos.forEach(p => {
            L.marker([p.lat, p.lon], {icon: recIcon})
                .addTo(map)
                .bindPopup(`<b>${p.nombre}</b><br>${p.direccion}<br>⏰ ${p.horario}`);
        });

        mapaIniciado = true;
    }

    if (btnVerPuntos) {
        btnVerPuntos.addEventListener('click', () => {
            if (seccionMapa) {
                seccionMapa.style.display = 'block';
                seccionMapa.scrollIntoView({ behavior: 'smooth' });
                iniciarMapa();
            }
        });
    }
});

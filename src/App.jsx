// Páginas públicas
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Proyectos from './pages/Proyectos';
import Recursos from './pages/Recursos';
import Contacto from './pages/Contacto';
import Videos from './pages/Videos';
import GuiaHuertos from './pages/GuiaHuertos';
import PuntosReciclaje from './pages/PuntosReciclaje';
import Unauthorized from './pages/Unauthorized';

// Auth
import UnifiedLogin from './components/auth/UnifiedLogin';

// Páginas de administración
import Dashboard from './pages/admin/Dashboard';
import RecyclingPointsManager from './pages/admin/RecyclingPointsManager';
import EventsManager from './pages/admin/EventsManager';
import MessagesManager from './pages/admin/MessagesManager';

// Layout y Componentes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatBot from './components/chatbot/ChatBot';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
    return (
        <AuthProvider>
            <EventsProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={
                            <div className="App">
                                <Header />
                                <main><Home /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/nosotros" element={
                            <div className="App">
                                <Header />
                                <main><Nosotros /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/proyectos" element={
                            <div className="App">
                                <Header />
                                <main><Proyectos /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/recursos" element={
                            <div className="App">
                                <Header />
                                <main><Recursos /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/contacto" element={
                            <div className="App">
                                <Header />
                                <main><Contacto /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/videos" element={
                            <div className="App">
                                <Header />
                                <main><Videos /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/guia-huertos" element={
                            <div className="App">
                                <Header />
                                <main><GuiaHuertos /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        <Route path="/puntos-reciclaje" element={
                            <div className="App">
                                <Header />
                                <main><PuntosReciclaje /></main>
                                <Footer />
                                <ChatBot />
                            </div>
                        } />
                        {/* Ruta de login unificado */}
                        <Route path="/login" element={<UnifiedLogin />} />

                        {/* Ruta de acceso denegado */}
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Rutas protegidas de administración - Solo para rol 'admin' */}
                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="recycling-points" element={<RecyclingPointsManager />} />
                            <Route path="events" element={<EventsManager />} />
                            <Route path="messages" element={<MessagesManager />} />
                        </Route>
                    </Routes>
                </Router>
            </EventsProvider>
        </AuthProvider>
    );
}

export default App;

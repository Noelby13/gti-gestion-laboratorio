import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Reservas from './pages/Reservas';
import Inventario from './pages/Inventario';
import Catalogos from './pages/Catalogos';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-uncsm-white">
        {/* Header Corporativo */}
        <header className="bg-uncsm-blue text-white p-6 shadow-md border-b-4 border-uncsm-gold">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="text-3xl font-bold tracking-wide hover:opacity-80 transition-opacity">
              Gestión de Laboratorios <span className="font-light text-uncsm-gold text-2xl hidden md:inline ml-2">UNCSM</span>
            </Link>
            <nav>
              <Link to="/login" className="bg-uncsm-gold text-uncsm-blue font-bold px-4 py-2 rounded shadow hover:bg-yellow-600 transition-colors duration-300">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </header>

        {/* Rutas Principales */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/catalogos" element={<Catalogos />} />
        </Routes>

        {/* Footer Institucional */}
        <footer className="bg-uncsm-blue text-white p-8 border-t-4 border-uncsm-gold mt-auto">
          <div className="container mx-auto text-center flex flex-col items-center justify-center">
            <p className="text-sm mb-2 text-gray-300">Universidad Nacional Casimiro Sotelo Montenegro</p>
            <p className="text-xl text-uncsm-gold mt-4 font-serif italic" style={{ fontFamily: '"Monotype Corsiva", cursive, "Times New Roman", Times, serif' }}>
              "¡Revolucionando la Conciencia, Llegamos a la Libertad!"
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

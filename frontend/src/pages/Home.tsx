import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex items-center justify-center p-8">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl max-w-4xl border-t-4 border-uncsm-blue">
        <h2 className="text-4xl font-bold text-uncsm-blue mb-4">Bienvenido al Sistema</h2>
        <p className="text-lg text-gray-600 mb-8 font-light">
          Plataforma centralizada para la gestión de inventario y reserva de aulas de la Universidad Nacional Casimiro Sotelo Montenegro.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={() => navigate('/reservas')}
            className="p-6 bg-gray-50 rounded shadow border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-uncsm-blue"
          >
            <h3 className="text-xl font-bold text-uncsm-blue mb-2">Reservas</h3>
            <p className="text-sm text-gray-600">Reserva un espacio en los laboratorios rápidamente.</p>
          </button>
          <button 
            onClick={() => navigate('/inventario')}
            className="p-6 bg-gray-50 rounded shadow border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-uncsm-blue"
          >
            <h3 className="text-xl font-bold text-uncsm-blue mb-2">Inventario TI</h3>
            <p className="text-sm text-gray-600">Consulta el estado y ciclo de vida del equipo tecnológico.</p>
          </button>
          <button 
            onClick={() => navigate('/catalogos')}
            className="p-6 bg-gray-50 rounded shadow border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-uncsm-blue"
          >
            <h3 className="text-xl font-bold text-uncsm-blue mb-2">Configuración</h3>
            <p className="text-sm text-gray-600">Administra aulas, tipos de equipo y estaciones.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

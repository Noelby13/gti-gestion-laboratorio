import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular inicio de sesión
    alert('Sesión iniciada correctamente');
    navigate('/');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-uncsm-gold">
        <h2 className="text-3xl font-bold text-uncsm-blue mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
            <input type="text" className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-uncsm-blue" placeholder="Ingrese su usuario" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input type="password" className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-uncsm-blue" placeholder="********" required />
          </div>
          <button type="submit" className="w-full bg-uncsm-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            Ingresar
          </button>
        </form>
        <button onClick={() => navigate('/')} className="mt-4 w-full text-center text-sm text-gray-500 hover:text-uncsm-blue">
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

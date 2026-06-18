import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Catalogos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'aulas' | 'estaciones' | 'tipos'>('aulas');

  const [aulas, setAulas] = useState<any[]>([]);
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);

  const [nuevaAula, setNuevaAula] = useState({ nombreAula: '', edificio: '', capacidadPersonas: '' });
  const [nuevaEstacion, setNuevaEstacion] = useState({ idAula: '', identificador: '', tipo: 'Estudiante' });
  const [nuevoTipo, setNuevoTipo] = useState({ nombreTipo: '' });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const [resAulas, resEst, resTipos] = await Promise.all([
        fetch('http://localhost:3000/api/catalogo/aulas'),
        fetch('http://localhost:3000/api/catalogo/estaciones'),
        fetch('http://localhost:3000/api/catalogo/tipos-equipo')
      ]);
      setAulas(await resAulas.json());
      setEstaciones(await resEst.json());
      setTipos(await resTipos.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAula = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:3000/api/catalogo/aulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaAula)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear aula');
      setSuccessMsg('Aula creada exitosamente');
      setNuevaAula({ nombreAula: '', edificio: '', capacidadPersonas: '' });
      fetchData();
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  const handleCreateEstacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:3000/api/catalogo/estaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaEstacion)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear estación');
      setSuccessMsg('Estación creada exitosamente');
      setNuevaEstacion({ idAula: '', identificador: '', tipo: 'Estudiante' });
      fetchData();
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  const handleCreateTipo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:3000/api/catalogo/tipos-equipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTipo)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear tipo de equipo');
      setSuccessMsg('Tipo de equipo creado exitosamente');
      setNuevoTipo({ nombreTipo: '' });
      fetchData();
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex-grow container mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow border-t-4 border-uncsm-blue">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-uncsm-blue">Gestión de Catálogos</h2>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-uncsm-blue">
            &larr; Volver al Inicio
          </button>
        </div>

        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded font-bold">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded font-bold">{successMsg}</div>}

        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 font-bold ${activeTab === 'aulas' ? 'text-uncsm-blue border-b-2 border-uncsm-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('aulas'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Aulas y Laboratorios
          </button>
          <button 
            className={`px-4 py-2 font-bold ${activeTab === 'estaciones' ? 'text-uncsm-blue border-b-2 border-uncsm-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('estaciones'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Estaciones de Trabajo
          </button>
          <button 
            className={`px-4 py-2 font-bold ${activeTab === 'tipos' ? 'text-uncsm-blue border-b-2 border-uncsm-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('tipos'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Tipos de Equipo
          </button>
        </div>

        {activeTab === 'aulas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Registrar Aula</h3>
              <form onSubmit={handleCreateAula} className="bg-gray-50 p-4 border rounded space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-bold mb-1">Nombre</label>
                  <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Ej. Lab 4" value={nuevaAula.nombreAula} onChange={e => setNuevaAula({...nuevaAula, nombreAula: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Edificio</label>
                  <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Ej. Edificio B" value={nuevaAula.edificio} onChange={e => setNuevaAula({...nuevaAula, edificio: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Capacidad de Personas</label>
                  <input type="number" required min="1" className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" value={nuevaAula.capacidadPersonas} onChange={e => setNuevaAula({...nuevaAula, capacidadPersonas: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-uncsm-blue text-white font-bold py-2 rounded hover:bg-blue-800 transition-colors">Guardar Aula</button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Aulas Registradas</h3>
              <div className="bg-white border rounded overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Edificio</th>
                      <th className="p-3">Capacidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aulas.map(a => (
                      <tr key={a.idAula} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{a.idAula}</td>
                        <td className="p-3 font-bold text-uncsm-blue">{a.nombreAula}</td>
                        <td className="p-3">{a.edificio}</td>
                        <td className="p-3">{a.capacidadPersonas} personas</td>
                      </tr>
                    ))}
                    {aulas.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No hay aulas registradas</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estaciones' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Registrar Estación</h3>
              <form onSubmit={handleCreateEstacion} className="bg-gray-50 p-4 border rounded space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-bold mb-1">Aula Pertenece A</label>
                  <select required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" value={nuevaEstacion.idAula} onChange={e => setNuevaEstacion({...nuevaEstacion, idAula: e.target.value})}>
                    <option value="">Seleccione un aula...</option>
                    {aulas.map(a => <option key={a.idAula} value={a.idAula}>{a.nombreAula} ({a.edificio})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Identificador</label>
                  <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Ej. PC-01, Mesa Docente" value={nuevaEstacion.identificador} onChange={e => setNuevaEstacion({...nuevaEstacion, identificador: e.target.value})} />
                  <p className="text-xs text-gray-500 mt-1">Debe ser único dentro del aula.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tipo de Estación</label>
                  <select required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" value={nuevaEstacion.tipo} onChange={e => setNuevaEstacion({...nuevaEstacion, tipo: e.target.value})}>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                    <option value="Infraestructura">Infraestructura (Rack, Server)</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-uncsm-blue text-white font-bold py-2 rounded hover:bg-blue-800 transition-colors">Guardar Estación</button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Estaciones Registradas</h3>
              <div className="bg-white border rounded overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-3">Aula</th>
                      <th className="p-3">Identificador</th>
                      <th className="p-3">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estaciones.map(e => (
                      <tr key={e.idEstacion} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-bold text-gray-700">{e.nombreAula} <span className="text-xs font-normal text-gray-400">({e.edificio})</span></td>
                        <td className="p-3 font-bold text-uncsm-blue">{e.identificador}</td>
                        <td className="p-3"><span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{e.tipo}</span></td>
                      </tr>
                    ))}
                    {estaciones.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-500">No hay estaciones registradas</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tipos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Registrar Tipo</h3>
              <form onSubmit={handleCreateTipo} className="bg-gray-50 p-4 border rounded space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-bold mb-1">Nombre del Tipo</label>
                  <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Ej. Monitor, Teclado, Impresora" value={nuevoTipo.nombreTipo} onChange={e => setNuevoTipo({...nuevoTipo, nombreTipo: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-uncsm-blue text-white font-bold py-2 rounded hover:bg-blue-800 transition-colors">Guardar Tipo</button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Tipos de Equipo Registrados</h3>
              <div className="bg-white border rounded overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Nombre Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipos.map(t => (
                      <tr key={t.idTipoEquipo} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500 w-16">{t.idTipoEquipo}</td>
                        <td className="p-3 font-bold text-gray-800">{t.nombreTipo}</td>
                      </tr>
                    ))}
                    {tipos.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-gray-500">No hay tipos registrados</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

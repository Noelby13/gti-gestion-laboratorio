import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errorReserva, setErrorReserva] = useState('');
  
  // States for the new 3-step flow
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [idAula, setIdAula] = useState('');
  const [estadisticas, setEstadisticas] = useState<any[]>([]);
  const [aulaSeleccionadaObj, setAulaSeleccionadaObj] = useState<any>(null);
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // Generate time intervals from 07:00 to 22:00
  const timeOptions = [];
  for (let h = 7; h <= 22; h++) {
    const hs = h.toString().padStart(2, '0');
    timeOptions.push(`${hs}:00`);
    if (h !== 22) timeOptions.push(`${hs}:30`);
  }

  const fetchData = async () => {
    try {
      const [resRes, resAulas] = await Promise.all([
        fetch('http://localhost:3000/api/reservas'),
        fetch('http://localhost:3000/api/catalogo/aulas')
      ]);
      setReservas(await resRes.json());
      setAulas(await resAulas.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAulaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setIdAula(selected);
    if (selected) {
      const aulaObj = aulas.find(a => a.idAula === parseInt(selected));
      setAulaSeleccionadaObj(aulaObj || null);
      try {
        const res = await fetch(`http://localhost:3000/api/inventario/estadisticas/${selected}`);
        if (res.ok) {
          const stats = await res.json();
          // Solo mostrar Disponibles y En Mantenimiento
          const statsFiltrados = stats.filter((s: any) => s.estado === 'Disponible' || s.estado === 'En Mantenimiento');
          setEstadisticas(statsFiltrados);
        }
      } catch (e) {
        console.error('Error fetching estadisticas');
      }
    } else {
      setAulaSeleccionadaObj(null);
      setEstadisticas([]);
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorReserva('');
    
    // Combine Date and Time
    const startDateTime = `${fecha}T${horaInicio}:00`;
    const endDateTime = `${fecha}T${horaFin}:00`;

    if (new Date(startDateTime) >= new Date(endDateTime)) {
      setErrorReserva('La hora de inicio debe ser anterior a la hora de fin.');
      return;
    }

    try {
      const resp = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idAula: parseInt(idAula),
          fechaInicio: startDateTime,
          fechaFin: endDateTime
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorReserva(data.error || 'Error agendando reserva');
        return;
      }
      resetForm();
      fetchData();
    } catch (error) {
      setErrorReserva('Error de conexión');
    }
  };

  const resetForm = () => {
    setMostrarForm(false);
    setPaso(1);
    setIdAula('');
    setAulaSeleccionadaObj(null);
    setFecha(new Date().toISOString().split('T')[0]); // Sugiere el día de hoy
    setHoraInicio('');
    setHoraFin('');
    setEstadisticas([]);
  };

  const openForm = () => {
    if (mostrarForm) {
      resetForm();
    } else {
      setMostrarForm(true);
      if (!fecha) {
        setFecha(new Date().toISOString().split('T')[0]);
      }
    }
  };

  const handleHoraInicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const start = e.target.value;
    setHoraInicio(start);
    
    // Sugiere hora fin 2 horas despues
    if (start) {
      const [h, m] = start.split(':').map(Number);
      const endH = h + 2;
      if (endH <= 22) {
        setHoraFin(`${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      } else {
        setHoraFin('');
      }
    } else {
      setHoraFin('');
    }
  };

  return (
    <div className="flex-grow container mx-auto p-8">
      <div className="bg-white p-8 rounded-lg shadow border-t-4 border-uncsm-blue">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-uncsm-blue">Módulo de Reservas</h2>
          <div>
            <button onClick={openForm} className="bg-uncsm-gold text-uncsm-blue font-bold px-4 py-2 rounded mr-4 hover:bg-yellow-600">
              {mostrarForm ? 'Cerrar' : '+ Agendar Espacio'}
            </button>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-uncsm-blue">
              &larr; Volver
            </button>
          </div>
        </div>
        
        {errorReserva && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-300">{errorReserva}</div>}

        {mostrarForm && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleCrear} className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-uncsm-blue">Paso {paso} de 3</h3>
              
              {paso === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div>
                     <label className="block text-sm font-bold mb-2 text-gray-700">Selecciona el Aula o Laboratorio</label>
                     <select required className="w-full border-2 border-gray-200 focus:border-uncsm-blue p-3 rounded-lg outline-none transition-colors" value={idAula} onChange={handleAulaChange}>
                       <option value="">Seleccione un aula...</option>
                       {aulas.map(a => <option key={a.idAula} value={a.idAula}>{a.nombreAula} ({a.edificio})</option>)}
                     </select>
                   </div>
                   
                   {idAula && (
                     <div className="bg-blue-50/50 p-5 border border-blue-100 rounded-lg shadow-inner">
                       <h4 className="font-bold mb-3 text-uncsm-blue">Disponibilidad de Dispositivos</h4>
                       {estadisticas.length === 0 ? (
                         <p className="text-sm text-gray-500">No hay equipos registrados como Disponibles o En Mantenimiento en esta aula.</p>
                       ) : (
                         <div className="flex flex-wrap gap-4">
                           {estadisticas.map(st => (
                             <div key={st.estado} className="flex flex-col items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm min-w-[110px]">
                               <span className="text-3xl font-black text-uncsm-blue">{st.cantidad}</span>
                               <span className="text-xs uppercase text-gray-500 font-bold mt-1">{st.estado}</span>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   )}
                   <div className="pt-4 flex justify-end">
                     <button type="button" disabled={!idAula} onClick={() => setPaso(2)} className="bg-uncsm-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">Continuar &rarr;</button>
                   </div>
                </div>
              )}

              {paso === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div>
                     <label className="block text-sm font-bold mb-2 text-gray-700">Selecciona la Fecha de Reserva</label>
                     <input type="date" required className="w-full md:w-1/2 border-2 border-gray-200 focus:border-uncsm-blue p-3 rounded-lg outline-none transition-colors" value={fecha} onChange={e => setFecha(e.target.value)} />
                   </div>
                   <div className="pt-6 flex justify-between">
                     <button type="button" onClick={() => setPaso(1)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">&larr; Volver</button>
                     <button type="button" disabled={!fecha} onClick={() => setPaso(3)} className="bg-uncsm-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">Continuar &rarr;</button>
                   </div>
                </div>
              )}

              {paso === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-bold mb-2 text-gray-700">Hora de Inicio</label>
                       <select required className="w-full border-2 border-gray-200 focus:border-uncsm-blue p-3 rounded-lg outline-none transition-colors" value={horaInicio} onChange={handleHoraInicioChange}>
                         <option value="">Seleccione hora...</option>
                         {timeOptions.map(t => <option key={`inicio-${t}`} value={t}>{t}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-bold mb-2 text-gray-700">Hora de Fin</label>
                       <select required className="w-full border-2 border-gray-200 focus:border-uncsm-blue p-3 rounded-lg outline-none transition-colors" value={horaFin} onChange={e => setHoraFin(e.target.value)}>
                         <option value="">Seleccione hora...</option>
                         {timeOptions.map(t => <option key={`fin-${t}`} value={t}>{t}</option>)}
                       </select>
                     </div>
                   </div>
                   <div className="pt-6 flex justify-between">
                     <button type="button" onClick={() => setPaso(2)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">&larr; Volver</button>
                     <button type="submit" disabled={!horaInicio || !horaFin} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">Confirmar Reserva</button>
                   </div>
                </div>
              )}
            </form>

            {/* Sidebar Context Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <h4 className="font-bold text-lg text-uncsm-blue mb-4 border-b border-blue-200 pb-2">Resumen de Reserva</h4>
                
                <div className="space-y-4">
                  {/* Aula Info */}
                  <div className={`p-3 rounded-lg border ${paso === 1 ? 'bg-white border-uncsm-blue shadow-sm' : idAula ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 uppercase">1. Aula</span>
                      {idAula && paso > 1 && (
                        <button type="button" onClick={() => setPaso(1)} className="text-xs text-blue-600 hover:text-blue-800 underline">Editar</button>
                      )}
                    </div>
                    {idAula && aulaSeleccionadaObj ? (
                      <div className="mt-1">
                        <p className="font-bold text-gray-800">{aulaSeleccionadaObj.nombreAula}</p>
                        <p className="text-sm text-gray-600">Capacidad: {aulaSeleccionadaObj.capacidadPersonas} alumnos</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1 italic">Pendiente</p>
                    )}
                  </div>

                  {/* Fecha Info */}
                  <div className={`p-3 rounded-lg border ${paso === 2 ? 'bg-white border-uncsm-blue shadow-sm' : fecha ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 uppercase">2. Fecha</span>
                      {fecha && paso > 2 && (
                        <button type="button" onClick={() => setPaso(2)} className="text-xs text-blue-600 hover:text-blue-800 underline">Editar</button>
                      )}
                    </div>
                    {fecha ? (
                      <p className="font-bold text-gray-800 mt-1">{new Date(`${fecha}T00:00:00`).toLocaleDateString()}</p>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1 italic">Pendiente</p>
                    )}
                  </div>

                  {/* Horario Info */}
                  <div className={`p-3 rounded-lg border ${paso === 3 ? 'bg-white border-uncsm-blue shadow-sm' : (horaInicio && horaFin) ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 uppercase">3. Horario</span>
                    </div>
                    {horaInicio && horaFin ? (
                      <p className="font-bold text-gray-800 mt-1">{horaInicio} - {horaFin}</p>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1 italic">Pendiente</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded border border-gray-200 overflow-x-auto">
           <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                 <tr>
                    <th className="px-4 py-2">Aula</th>
                    <th className="px-4 py-2">Usuario</th>
                    <th className="px-4 py-2">Inicio</th>
                    <th className="px-4 py-2">Fin</th>
                 </tr>
              </thead>
              <tbody>
                 {reservas.map((r: any) => (
                   <tr key={r.idReserva} className="border-b">
                      <td className="px-4 py-2 font-bold">{r.nombreAula}</td>
                      <td className="px-4 py-2">{r.usuario}</td>
                      <td className="px-4 py-2">{new Date(r.fechaInicio).toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(r.fechaFin).toLocaleString()}</td>
                   </tr>
                 ))}
                 {reservas.length === 0 && <tr><td colSpan={4} className="text-center py-4">No hay reservas programadas</td></tr>}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

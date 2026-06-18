import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errorReserva, setErrorReserva] = useState('');
  
  // States for the form
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [idAula, setIdAula] = useState('');
  const [estadisticas, setEstadisticas] = useState<any[]>([]);
  const [aulaSeleccionadaObj, setAulaSeleccionadaObj] = useState<any>(null);
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // States for Views
  const [vista, setVista] = useState<'lista' | 'calendario' | 'timeline'>('lista');
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [filtroUsuario, setFiltroUsuario] = useState('');

  const timeOptions = [];
  for (let h = 7; h <= 22; h++) {
    const hs = h.toString().padStart(2, '0');
    timeOptions.push(`${hs}:00`);
    if (h !== 22) timeOptions.push(`${hs}:30`);
  }

  const colorAulas = [
    'bg-blue-100 border-blue-300 text-blue-900',
    'bg-green-100 border-green-300 text-green-900',
    'bg-purple-100 border-purple-300 text-purple-900',
    'bg-pink-100 border-pink-300 text-pink-900',
    'bg-orange-100 border-orange-300 text-orange-900',
  ];

  const getColorForAula = (aulaId: number) => {
    return colorAulas[aulaId % colorAulas.length];
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

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
    setFecha(new Date().toISOString().split('T')[0]);
    setHoraInicio('');
    setHoraFin('');
    setEstadisticas([]);
  };

  const openForm = () => {
    if (mostrarForm) resetForm();
    else {
      setMostrarForm(true);
      if (!fecha) setFecha(new Date().toISOString().split('T')[0]);
    }
  };

  const handleHoraInicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const start = e.target.value;
    setHoraInicio(start);
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

  // Filtered logic
  const reservasFiltradas = reservas.filter(r => {
    const matchFiltroUser = r.usuario.toLowerCase().includes(filtroUsuario.toLowerCase());
    return matchFiltroUser;
  });

  const reservasDelDia = reservasFiltradas.filter(r => {
    return r.fechaInicio.startsWith(filtroFecha);
  });

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 flex flex-col gap-6">
      
      {/* HEADER & MAIN CONTROLS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-uncsm-blue">Reservas de Espacios</h2>
            <p className="text-gray-500 mt-1 text-sm">Gestiona y visualiza la disponibilidad de aulas y laboratorios.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-uncsm-blue font-semibold px-4 py-2">
              &larr; Volver
            </button>
            <button onClick={openForm} className="bg-uncsm-gold text-uncsm-blue font-bold px-5 py-2.5 rounded-lg shadow hover:bg-yellow-600 transition-colors">
              {mostrarForm ? 'Cerrar Formulario' : '+ Agendar Espacio'}
            </button>
          </div>
        </div>

        {/* Control Bar: Vistas y Filtros */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['lista', 'calendario', 'timeline'] as const).map(v => (
              <button 
                key={v}
                onClick={() => setVista(v)}
                className={`px-4 py-2 rounded-md font-semibold text-sm capitalize transition-all ${vista === v ? 'bg-white text-uncsm-blue shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fecha:</label>
              <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} className="border p-2 rounded outline-none focus:ring-2 focus:ring-uncsm-blue text-sm"/>
            </div>
            <div className="flex items-center gap-2 flex-grow">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Usuario:</label>
              <input type="text" placeholder="Buscar..." value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)} className="border p-2 rounded outline-none focus:ring-2 focus:ring-uncsm-blue text-sm w-full"/>
            </div>
          </div>
        </div>
      </div>

      {errorReserva && <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300 font-semibold">{errorReserva}</div>}

      {/* RESERVATION FORM WIZARD */}
      {mostrarForm && (
        <div className="mb-2 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleCrear} className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-uncsm-blue border-b pb-2">Nueva Reserva - Paso {paso} de 3</h3>
            
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
            <div className="sticky top-6 bg-blue-50/70 rounded-xl p-6 border border-blue-100 shadow-sm">
              <h4 className="font-bold text-lg text-uncsm-blue mb-4 border-b border-blue-200 pb-2">Resumen de Reserva</h4>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border transition-all ${paso === 1 ? 'bg-white border-uncsm-blue shadow-md scale-105' : idAula ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase">1. Aula</span>
                    {idAula && paso > 1 && (
                      <button type="button" onClick={() => setPaso(1)} className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold">Editar</button>
                    )}
                  </div>
                  {idAula && aulaSeleccionadaObj ? (
                    <div className="mt-2">
                      <p className="font-bold text-gray-900 leading-tight">{aulaSeleccionadaObj.nombreAula}</p>
                      <p className="text-sm text-gray-600 mt-1">Capacidad: {aulaSeleccionadaObj.capacidadPersonas} alumnos</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 italic">Pendiente</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border transition-all ${paso === 2 ? 'bg-white border-uncsm-blue shadow-md scale-105' : fecha ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase">2. Fecha</span>
                    {fecha && paso > 2 && (
                      <button type="button" onClick={() => setPaso(2)} className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold">Editar</button>
                    )}
                  </div>
                  {fecha ? (
                    <p className="font-bold text-gray-900 mt-2">{formatShortDate(`${fecha}T00:00:00`)}</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 italic">Pendiente</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border transition-all ${paso === 3 ? 'bg-white border-uncsm-blue shadow-md scale-105' : (horaInicio && horaFin) ? 'bg-white border-green-200' : 'bg-transparent border-dashed border-gray-300'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase">3. Horario</span>
                  </div>
                  {horaInicio && horaFin ? (
                    <p className="font-bold text-gray-900 mt-2">{horaInicio} - {horaFin}</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 italic">Pendiente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWS RENDERING */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
        
        {vista === 'lista' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Aula</th>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Horario</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((r: any) => {
                  const colorClass = aulas.findIndex(a => a.nombreAula === r.nombreAula);
                  return (
                    <tr key={r.idReserva} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColorForAula(colorClass >= 0 ? colorClass : 0)}`}>
                          {r.nombreAula}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{r.usuario}</td>
                      <td className="px-6 py-4">{formatShortDate(r.fechaInicio)}</td>
                      <td className="px-6 py-4 font-mono text-xs">{formatTime(r.fechaInicio)} - {formatTime(r.fechaFin)}</td>
                    </tr>
                  )
                })}
                {reservasFiltradas.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-gray-500">No hay reservas que coincidan con los filtros.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {vista === 'calendario' && (
          <div className="p-6">
            <h3 className="font-bold text-gray-700 mb-4">Día: {formatShortDate(`${filtroFecha}T00:00:00`)}</h3>
            <div className="grid grid-cols-[80px_1fr] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              {/* Eje Y: Horas */}
              <div className="border-r border-gray-200 bg-white">
                 {timeOptions.map(t => {
                   if(t.endsWith(':30')) return null; // Solo mostrar horas enteras
                   return (
                     <div key={t} className="h-16 border-b border-gray-100 flex items-start justify-center pt-2 text-xs font-bold text-gray-400">
                       {t}
                     </div>
                   )
                 })}
              </div>
              {/* Contenedor de bloques (Daily Calendar) */}
              <div className="relative bg-white" style={{ height: `${(22 - 7) * 4}rem` }}>
                 {timeOptions.map(t => {
                   if(t.endsWith(':30')) return null;
                   return <div key={t} className="h-16 border-b border-dashed border-gray-100 absolute w-full" style={{ top: `${(parseInt(t.split(':')[0]) - 7) * 4}rem` }}></div>
                 })}

                 {reservasDelDia.map(r => {
                   const startD = new Date(r.fechaInicio);
                   const endD = new Date(r.fechaFin);
                   const startHour = startD.getHours() + (startD.getMinutes() / 60);
                   const endHour = endD.getHours() + (endD.getMinutes() / 60);
                   
                   const top = (startHour - 7) * 4; // 4rem per hour
                   const height = (endHour - startHour) * 4;
                   
                   const colorClassIdx = aulas.findIndex(a => a.nombreAula === r.nombreAula);
                   const colorTheme = getColorForAula(colorClassIdx >= 0 ? colorClassIdx : 0);

                   return (
                     <div 
                       key={r.idReserva}
                       className={`absolute left-2 right-2 rounded-lg border shadow-sm p-2 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:z-10 cursor-pointer ${colorTheme}`}
                       style={{ top: `${top}rem`, height: `${height}rem` }}
                     >
                       <p className="text-xs font-bold truncate">{formatTime(r.fechaInicio)} - {formatTime(r.fechaFin)}</p>
                       <p className="font-bold text-sm truncate leading-tight mt-1">{r.nombreAula}</p>
                       <p className="text-xs opacity-80 truncate">{r.usuario}</p>
                     </div>
                   )
                 })}
              </div>
            </div>
          </div>
        )}

        {vista === 'timeline' && (
          <div className="p-6 overflow-x-auto">
             <h3 className="font-bold text-gray-700 mb-4">Línea de Tiempo - {formatShortDate(`${filtroFecha}T00:00:00`)}</h3>
             <div className="min-w-[800px] border border-gray-200 rounded-lg overflow-hidden">
                {/* Header Horas */}
                <div className="flex bg-gray-50 border-b border-gray-200">
                  <div className="w-48 flex-shrink-0 p-3 font-bold text-sm text-gray-500 uppercase border-r border-gray-200">Aula</div>
                  <div className="flex-grow flex relative h-12">
                     {Array.from({length: 16}).map((_, i) => (
                       <div key={i} className="flex-1 border-r border-gray-200/50 relative">
                         <span className="absolute -left-3 top-3 text-xs font-bold text-gray-400">{i + 7}:00</span>
                       </div>
                     ))}
                  </div>
                </div>
                {/* Filas de Aulas */}
                <div className="bg-white">
                  {aulas.map((aula, idx) => {
                    const reservasAula = reservasDelDia.filter(r => r.nombreAula === aula.nombreAula);
                    const colorTheme = getColorForAula(idx);
                    return (
                      <div key={aula.idAula} className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-48 flex-shrink-0 p-4 font-bold text-sm text-gray-800 border-r border-gray-200 flex items-center">
                          {aula.nombreAula}
                        </div>
                        <div className="flex-grow relative h-20">
                          {Array.from({length: 16}).map((_, i) => (
                            <div key={i} className="absolute h-full w-[6.25%] border-r border-dashed border-gray-100" style={{ left: `${i * 6.25}%` }}></div>
                          ))}
                          
                          {reservasAula.map(r => {
                            const startD = new Date(r.fechaInicio);
                            const endD = new Date(r.fechaFin);
                            const startHour = startD.getHours() + (startD.getMinutes() / 60);
                            const duration = (endD.getHours() + endD.getMinutes()/60) - startHour;
                            
                            const leftPercent = ((startHour - 7) / 16) * 100;
                            const widthPercent = (duration / 16) * 100;

                            return (
                              <div 
                                key={r.idReserva}
                                className={`absolute top-2 bottom-2 rounded-md border p-2 overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer z-10 ${colorTheme}`}
                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              >
                                <p className="text-xs font-bold whitespace-nowrap truncate">{formatTime(r.fechaInicio)} - {formatTime(r.fechaFin)}</p>
                                <p className="text-xs font-medium whitespace-nowrap truncate opacity-90">{r.usuario}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
             </div>
          </div>
        )}



      </div>
    </div>
  );
}

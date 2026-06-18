import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inventario() {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  
  const [historialModalInfo, setHistorialModalInfo] = useState<{ visible: boolean, data: any[], codigo: string }>({ visible: false, data: [], codigo: '' });
  const [modalCambiarEstado, setModalCambiarEstado] = useState<{ visible: boolean, idComponente: number, estadoActual: string, nuevoEstado: string, observacion: string, codigo: string }>({
    visible: false, idComponente: 0, estadoActual: '', nuevoEstado: '', observacion: '', codigo: ''
  });
  
  // Nuevo estado para el select del aula (para poder filtrar)
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');

  const [nuevo, setNuevo] = useState({
    idEstacion: '',
    idTipoEquipo: '',
    codigoInventario: '',
    numeroSerie: '',
    estadoCicloVida: 'Disponible'
  });

  const fetchData = async () => {
    try {
      const [resEq, resAulas, resEst, resTip] = await Promise.all([
        fetch('http://localhost:3000/api/inventario'),
        fetch('http://localhost:3000/api/catalogo/aulas'),
        fetch('http://localhost:3000/api/catalogo/estaciones'),
        fetch('http://localhost:3000/api/catalogo/tipos-equipo')
      ]);
      setEquipos(await resEq.json());
      setAulas(await resAulas.json());
      setEstaciones(await resEst.json());
      setTipos(await resTip.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const estacionesFiltradas = aulaSeleccionada 
    ? estaciones.filter(e => e.idAula === parseInt(aulaSeleccionada))
    : [];

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm('');
    try {
      const resp = await fetch('http://localhost:3000/api/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorForm(data.error || 'Error creando equipo');
        return;
      }
      setMostrarForm(false);
      setNuevo({ ...nuevo, codigoInventario: '', numeroSerie: '', idEstacion: '' });
      setAulaSeleccionada('');
      fetchData();
    } catch (error) {
      setErrorForm('Error de conexión al crear equipo');
    }
  };

  const abrirModalCambiarEstado = (id: number, estadoActual: string, codigo: string) => {
    setModalCambiarEstado({
      visible: true,
      idComponente: id,
      estadoActual,
      nuevoEstado: '', // Se forzará al usuario a elegir
      observacion: '',
      codigo
    });
  };

  const confirmarCambioEstado = async () => {
    if (!modalCambiarEstado.nuevoEstado) {
      alert('Por favor, seleccione el nuevo estado.');
      return;
    }
    try {
      const resp = await fetch(`http://localhost:3000/api/inventario/${modalCambiarEstado.idComponente}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estadoCicloVida: modalCambiarEstado.nuevoEstado, 
          observacion: modalCambiarEstado.observacion 
        })
      });
      if (!resp.ok) {
        alert('Error al cambiar el estado del equipo.');
        return;
      }
      setModalCambiarEstado({ ...modalCambiarEstado, visible: false });
      fetchData();
    } catch (error) {
      alert('Error de red cambiando estado');
    }
  };

  const verHistorial = async (id: number, codigo: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/inventario/${id}/historial`);
      if (res.ok) {
        const data = await res.json();
        setHistorialModalInfo({ visible: true, data, codigo });
      } else {
        alert('Error al obtener el historial');
      }
    } catch (e) {
      alert('Error de red obteniendo historial');
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-uncsm-gold">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-uncsm-blue">Inventario de TI</h2>
            <p className="text-gray-500 text-sm mt-1">Gestiona los equipos tecnológicos y su ciclo de vida.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMostrarForm(!mostrarForm)} 
              className={`px-5 py-2.5 rounded font-bold shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none ${mostrarForm ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300' : 'bg-uncsm-blue text-white hover:bg-blue-800 focus:ring-uncsm-blue'}`}
            >
              {mostrarForm ? 'Cerrar Formulario' : '+ Registrar Nuevo Equipo'}
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-500 hover:text-uncsm-blue font-semibold border px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
        
        {/* Formulario */}
        {mostrarForm && (
          <div className="mb-10 bg-blue-50/50 p-6 rounded-lg border border-blue-100 shadow-sm transition-all">
            <h3 className="text-xl font-bold text-uncsm-blue mb-4 border-b border-blue-200 pb-2">Datos del Nuevo Equipo</h3>
            <form onSubmit={handleCrear} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {errorForm && <div className="col-span-full bg-red-100 text-red-700 p-3 rounded border border-red-300 font-bold">{errorForm}</div>}
              
              <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-700 mb-1">Código Inventario</label>
                 <input required className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Ej. TI-0001" value={nuevo.codigoInventario} onChange={e => setNuevo({...nuevo, codigoInventario: e.target.value})} />
              </div>
              
              <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-700 mb-1">Número de Serie</label>
                 <input className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none" placeholder="Opcional" value={nuevo.numeroSerie} onChange={e => setNuevo({...nuevo, numeroSerie: e.target.value})} />
              </div>
              
              <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-700 mb-1">Tipo de Equipo</label>
                 <select required className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none bg-white" value={nuevo.idTipoEquipo} onChange={e => setNuevo({...nuevo, idTipoEquipo: e.target.value})}>
                   <option value="">Seleccione el tipo...</option>
                   {tipos.map(t => <option key={t.idTipoEquipo} value={t.idTipoEquipo}>{t.nombreTipo}</option>)}
                 </select>
              </div>

              <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-700 mb-1">Aula / Laboratorio</label>
                 <select required className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none bg-white" value={aulaSeleccionada} onChange={e => { setAulaSeleccionada(e.target.value); setNuevo({...nuevo, idEstacion: ''}); }}>
                   <option value="">Seleccione el aula...</option>
                   {aulas.map(a => <option key={a.idAula} value={a.idAula}>{a.nombreAula}</option>)}
                 </select>
              </div>

              <div className="flex flex-col">
                 <label className="text-sm font-semibold text-gray-700 mb-1">Estación de Trabajo</label>
                 <select required disabled={!aulaSeleccionada} className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400" value={nuevo.idEstacion} onChange={e => setNuevo({...nuevo, idEstacion: e.target.value})}>
                   <option value="">Seleccione la estación...</option>
                   {estacionesFiltradas.map(e => <option key={e.idEstacion} value={e.idEstacion}>{e.identificador} ({e.tipo})</option>)}
                 </select>
                 {!aulaSeleccionada && <span className="text-xs text-gray-400 mt-1">Seleccione un aula primero</span>}
              </div>

              <div className="col-span-full mt-2">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded font-bold shadow hover:bg-green-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-green-600 focus:outline-none">Guardar Registro</button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">Código</th>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">Tipo</th>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">Aula</th>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">Estación</th>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs text-center">Estado</th>
                      <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs text-center">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {equipos.map((eq: any) => (
                     <tr key={eq.idComponente} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-uncsm-blue">{eq.codigoInventario}</td>
                        <td className="px-6 py-4 text-gray-700">{eq.nombreTipo}</td>
                        <td className="px-6 py-4 text-gray-700">{eq.aula}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-700 border px-2 py-1 rounded text-xs">{eq.estacion}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${eq.estadoCicloVida === 'Disponible' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            {eq.estadoCicloVida}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-3">
                            <button 
                              onClick={() => abrirModalCambiarEstado(eq.idComponente, eq.estadoCicloVida, eq.codigoInventario)} 
                              className="text-sm font-semibold text-uncsm-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                            >
                              Cambiar Estado
                            </button>
                            <button 
                              onClick={() => verHistorial(eq.idComponente, eq.codigoInventario)} 
                              className="text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors"
                            >
                              Historial
                            </button>
                          </div>
                        </td>
                     </tr>
                   ))}
                   {equipos.length === 0 && (
                     <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                         No hay equipos registrados en el inventario.
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
           </div>
        </div>

        {/* Modal de Historial */}
        {historialModalInfo.visible && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
              <div className="p-5 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                <h3 className="font-bold text-xl text-gray-800">
                  Historial de Estado <span className="text-uncsm-blue ml-2">{historialModalInfo.codigo}</span>
                </h3>
                <button 
                  onClick={() => setHistorialModalInfo({ visible: false, data: [], codigo: '' })} 
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {historialModalInfo.data.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No hay historial registrado para este equipo.</p>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {historialModalInfo.data.map(h => (
                      <div key={h.idHistorial} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-800">{h.estado}</h4>
                            <time className="text-xs text-gray-500 font-medium">{new Date(h.fechaCambio).toLocaleString()}</time>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{h.observacion || <em className="text-gray-400">Sin observación adicional</em>}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                 <button onClick={() => setHistorialModalInfo({ visible: false, data: [], codigo: '' })} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
                   Cerrar
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cambiar Estado */}
        {modalCambiarEstado.visible && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
              <div className="p-5 bg-blue-50 flex justify-between items-center border-b border-blue-100">
                <h3 className="font-bold text-xl text-uncsm-blue">
                  Cambiar Estado
                </h3>
                <button 
                  onClick={() => setModalCambiarEstado({ ...modalCambiarEstado, visible: false })} 
                  className="text-blue-400 hover:text-blue-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <p className="mb-4 text-gray-700">
                  El equipo <strong>{modalCambiarEstado.codigo}</strong> tiene el estado actual: <span className="font-semibold text-gray-500">{modalCambiarEstado.estadoActual}</span>.
                </p>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Seleccione el nuevo estado:</label>
                  <select 
                    className="border p-2.5 rounded shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none bg-white"
                    value={modalCambiarEstado.nuevoEstado}
                    onChange={(e) => setModalCambiarEstado({ ...modalCambiarEstado, nuevoEstado: e.target.value })}
                  >
                    <option value="">-- Seleccionar Estado --</option>
                    <option value="Disponible">Disponible</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Bodega">Bodega</option>
                    <option value="Retirado">Retirado</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Breve descripción u observación:</label>
                  <textarea 
                    className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-uncsm-blue outline-none resize-none" 
                    rows={3}
                    placeholder="Ej. Cambio de RAM, envío a soporte, listo para usar..."
                    value={modalCambiarEstado.observacion}
                    onChange={(e) => setModalCambiarEstado({ ...modalCambiarEstado, observacion: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3">
                 <button 
                   onClick={() => setModalCambiarEstado({ ...modalCambiarEstado, visible: false })} 
                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={confirmarCambioEstado} 
                   className="bg-uncsm-blue hover:bg-blue-800 text-white font-bold py-2 px-6 rounded shadow transition-colors"
                 >
                   Confirmar Cambio
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

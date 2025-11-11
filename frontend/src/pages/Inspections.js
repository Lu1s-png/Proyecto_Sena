import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  FileText,
  X,
  Save
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Inspections = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [filters, setFilters] = useState({
    numeroInterno: '',
    placa: '',
    fechaInicio: '',
    fechaFin: '',
    usuario: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await axios.get(`/api/inspections?${params}`, config);
      setInspections(response.data.inspections || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching inspections:', error);
      toast.error('Error al cargar inspecciones');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const handleCreateInspection = () => {
    setModalMode('create');
    setSelectedInspection(null);
    reset();
    setShowModal(true);
  };

  const handleEditInspection = (inspection) => {
    setModalMode('edit');
    setSelectedInspection(inspection);
    reset({
      numeroInterno: inspection.numeroInterno,
      placa: inspection.placa,
      marca: inspection.marca,
      tipo: inspection.tipo,
      modelo: inspection.modelo,
      kilometraje: inspection.kilometraje,
      detallesEncontrados: inspection.detallesEncontrados,
      profundidadNeumaticos: inspection.profundidadNeumaticos
    });
    setShowModal(true);
  };

  const handleViewInspection = (inspection) => {
    setModalMode('view');
    setSelectedInspection(inspection);
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (modalMode === 'create') {
        await axios.post('/api/inspections', data, config);
        toast.success('Inspección creada exitosamente');
      } else if (modalMode === 'edit') {
        await axios.put(`/api/inspections/${selectedInspection._id}`, data, config);
        toast.success('Inspección actualizada exitosamente');
      }

      setShowModal(false);
      fetchInspections();
    } catch (error) {
      console.error('Error saving inspection:', error);
      toast.error(error.response?.data?.message || 'Error al guardar inspección');
    }
  };

  const handleDeleteInspection = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta inspección?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`/api/inspections/${id}`, config);
      toast.success('Inspección eliminada exitosamente');
      fetchInspections();
    } catch (error) {
      console.error('Error deleting inspection:', error);
      toast.error('Error al eliminar inspección');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      numeroInterno: '',
      placa: '',
      fechaInicio: '',
      fechaFin: '',
      usuario: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && inspections.length === 0) {
    return <LoadingSpinner message="Cargando inspecciones..." />;
  }

  return (
    <div className="inspections-page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">
                <FileText size={28} />
                Inspecciones Preoperacionales
              </h1>
              <p className="page-subtitle">
                Gestiona las inspecciones de vehículos de manera eficiente
              </p>
            </div>
            <button
              onClick={handleCreateInspection}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Nueva Inspección
            </button>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
              >
                <Filter size={16} />
                Filtros
              </button>
              {Object.values(filters).some(v => v) && (
                <button
                  onClick={clearFilters}
                  className="btn btn-outline btn-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {showFilters && (
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Número Interno</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por número interno"
                    value={filters.numeroInterno}
                    onChange={(e) => handleFilterChange('numeroInterno', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Placa</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por placa"
                    value={filters.placa}
                    onChange={(e) => handleFilterChange('placa', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.fechaInicio}
                    onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Fecha Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.fechaFin}
                    onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por usuario"
                    value={filters.usuario}
                    onChange={(e) => handleFilterChange('usuario', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Inspections Table */}
          <div className="table-container">
            {inspections.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Vehículo</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Kilometraje</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections.map((inspection) => (
                        <tr key={inspection._id}>
                          <td>
                            <div className="vehicle-info">
                              <div className="vehicle-primary">
                                {inspection.placa} - {inspection.marca}
                              </div>
                              <div className="vehicle-secondary">
                                {inspection.numeroInterno} | {inspection.tipo}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="date-info">
                              <div className="date-primary">
                                {format(new Date(inspection.fechaInspeccion), 'dd/MM/yyyy', { locale: es })}
                              </div>
                              <div className="date-secondary">
                                {inspection.horaInspeccion}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="user-info">
                              <User size={16} />
                              {inspection.usuario?.nombres || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <span className="kilometraje">
                              {inspection.kilometraje?.toLocaleString()} km
                            </span>
                          </td>
                          <td>
                            <span className={`status ${inspection.detallesEncontrados ? 'warning' : 'success'}`}>
                              {inspection.detallesEncontrados ? 'Con observaciones' : 'Sin observaciones'}
                            </span>
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                onClick={() => handleViewInspection(inspection)}
                                className="btn-icon"
                                title="Ver detalles"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditInspection(inspection)}
                                className="btn-icon"
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteInspection(inspection._id)}
                                className="btn-icon danger"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <div className="pagination-info">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} inspecciones
                  </div>
                  <div className="pagination-controls">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="btn btn-outline btn-sm"
                    >
                      Anterior
                    </button>
                    <span className="page-info">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn btn-outline btn-sm"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <FileText size={64} color="#e9ecef" />
                <h3>No hay inspecciones</h3>
                <p>Comienza creando tu primera inspección preoperacional</p>
                <button
                  onClick={handleCreateInspection}
                  className="btn btn-primary"
                >
                  <Plus size={20} />
                  Nueva Inspección
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">
                  {modalMode === 'create' && 'Nueva Inspección'}
                  {modalMode === 'edit' && 'Editar Inspección'}
                  {modalMode === 'view' && 'Detalles de Inspección'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {modalMode === 'view' ? (
                  <div className="inspection-details">
                    <div className="detail-section">
                      <h4>Información del Vehículo</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Número Interno:</label>
                          <span>{selectedInspection?.numeroInterno}</span>
                        </div>
                        <div className="detail-item">
                          <label>Placa:</label>
                          <span>{selectedInspection?.placa}</span>
                        </div>
                        <div className="detail-item">
                          <label>Marca:</label>
                          <span>{selectedInspection?.marca}</span>
                        </div>
                        <div className="detail-item">
                          <label>Tipo:</label>
                          <span>{selectedInspection?.tipo}</span>
                        </div>
                        <div className="detail-item">
                          <label>Modelo:</label>
                          <span>{selectedInspection?.modelo}</span>
                        </div>
                        <div className="detail-item">
                          <label>Kilometraje:</label>
                          <span>{selectedInspection?.kilometraje?.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Información de la Inspección</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Fecha:</label>
                          <span>{format(new Date(selectedInspection?.fechaInspeccion), 'dd/MM/yyyy', { locale: es })}</span>
                        </div>
                        <div className="detail-item">
                          <label>Hora:</label>
                          <span>{selectedInspection?.horaInspeccion}</span>
                        </div>
                        <div className="detail-item">
                          <label>Usuario:</label>
                          <span>{selectedInspection?.usuario?.nombres}</span>
                        </div>
                        <div className="detail-item">
                          <label>Profundidad Neumáticos:</label>
                          <span>{selectedInspection?.profundidadNeumaticos} mm</span>
                        </div>
                      </div>
                    </div>

                    {selectedInspection?.detallesEncontrados && (
                      <div className="detail-section">
                        <h4>Detalles Encontrados</h4>
                        <div className="detail-text">
                          {selectedInspection.detallesEncontrados}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="inspection-form">
                    <div className="form-section">
                      <h4>Información del Vehículo</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Número Interno *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.numeroInterno ? 'is-invalid' : ''}`}
                            {...register('numeroInterno', {
                              required: 'El número interno es requerido'
                            })}
                          />
                          {errors.numeroInterno && (
                            <div className="invalid-feedback">{errors.numeroInterno.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Placa *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.placa ? 'is-invalid' : ''}`}
                            {...register('placa', {
                              required: 'La placa es requerida'
                            })}
                          />
                          {errors.placa && (
                            <div className="invalid-feedback">{errors.placa.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Marca *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.marca ? 'is-invalid' : ''}`}
                            {...register('marca', {
                              required: 'La marca es requerida'
                            })}
                          />
                          {errors.marca && (
                            <div className="invalid-feedback">{errors.marca.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Tipo *</label>
                          <select
                            className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                            {...register('tipo', {
                              required: 'El tipo es requerido'
                            })}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="Automóvil">Automóvil</option>
                            <option value="Bus">Bus</option>
                            <option value="Otro">Otro</option>
                          </select>
                          {errors.tipo && (
                            <div className="invalid-feedback">{errors.tipo.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Modelo *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.modelo ? 'is-invalid' : ''}`}
                            {...register('modelo', {
                              required: 'El modelo es requerido'
                            })}
                          />
                          {errors.modelo && (
                            <div className="invalid-feedback">{errors.modelo.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Kilometraje *</label>
                          <input
                            type="number"
                            className={`form-control ${errors.kilometraje ? 'is-invalid' : ''}`}
                            {...register('kilometraje', {
                              required: 'El kilometraje es requerido',
                              min: { value: 0, message: 'El kilometraje debe ser mayor a 0' }
                            })}
                          />
                          {errors.kilometraje && (
                            <div className="invalid-feedback">{errors.kilometraje.message}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Detalles de la Inspección</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Profundidad Neumáticos (mm) *</label>
                          <input
                            type="number"
                            step="0.1"
                            className={`form-control ${errors.profundidadNeumaticos ? 'is-invalid' : ''}`}
                            {...register('profundidadNeumaticos', {
                              required: 'La profundidad de neumáticos es requerida',
                              min: { value: 0, message: 'La profundidad debe ser mayor a 0' }
                            })}
                          />
                          {errors.profundidadNeumaticos && (
                            <div className="invalid-feedback">{errors.profundidadNeumaticos.message}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Detalles Encontrados</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Describe cualquier observación o problema encontrado durante la inspección..."
                          {...register('detallesEncontrados')}
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="btn btn-outline"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        <Save size={16} />
                        {modalMode === 'create' ? 'Crear Inspección' : 'Actualizar Inspección'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        <style jsx="true">{`
          .inspections-page {
            min-height: calc(100vh - 70px);
            background-color: #f8f9fa;
            padding: 32px 0;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding: 24px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .page-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
          }

          .page-subtitle {
            color: #6c757d;
            margin: 0;
          }

          .filters-section {
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .filter-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .filter-group label {
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }

          .table-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .table-responsive {
            overflow-x: auto;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th {
            background-color: #f8f9fa;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e9ecef;
          }

          .table td {
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
          }

          .vehicle-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .vehicle-primary {
            font-weight: 600;
            color: #333;
          }

          .vehicle-secondary {
            font-size: 12px;
            color: #6c757d;
          }

          .date-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .date-primary {
            font-weight: 600;
            color: #333;
          }

          .date-secondary {
            font-size: 12px;
            color: #6c757d;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6c757d;
          }

          .kilometraje {
            font-weight: 600;
            color: #333;
          }

          .status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .status.success {
            background-color: #d4edda;
            color: #155724;
          }

          .status.warning {
            background-color: #fff3cd;
            color: #856404;
          }

          .actions {
            display: flex;
            gap: 8px;
          }

          .btn-icon {
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            color: #6c757d;
            transition: all 0.2s ease;
          }

          .btn-icon:hover {
            background-color: #f8f9fa;
            color: #007bff;
          }

          .btn-icon.danger:hover {
            background-color: #f8d7da;
            color: #dc3545;
          }

          .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-top: 1px solid #e9ecef;
          }

          .pagination-info {
            color: #6c757d;
            font-size: 14px;
          }

          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .page-info {
            color: #6c757d;
            font-size: 14px;
          }

          .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: #6c757d;
          }

          .empty-state h3 {
            margin: 24px 0 16px;
            color: #333;
          }

          .empty-state p {
            margin-bottom: 32px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }

          .modal {
            background: white;
            border-radius: 16px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #e9ecef;
          }

          .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .btn-close {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background-color 0.2s ease;
          }

          .btn-close:hover {
            background-color: #f8f9fa;
          }

          .modal-body {
            padding: 24px;
          }

          .inspection-details {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .detail-section h4 {
            color: #333;
            margin-bottom: 16px;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .detail-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .detail-item label {
            font-weight: 600;
            color: #6c757d;
            font-size: 14px;
          }

          .detail-item span {
            color: #333;
            font-weight: 500;
          }

          .detail-text {
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            color: #333;
            line-height: 1.6;
          }

          .inspection-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .form-section h4 {
            color: #333;
            margin-bottom: 16px;
            font-size: 1.1rem;
            font-weight: 600;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group label {
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }

          .form-control {
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s ease;
          }

          .form-control:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
          }

          .form-control.is-invalid {
            border-color: #dc3545;
          }

          .invalid-feedback {
            color: #dc3545;
            font-size: 14px;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 24px;
            border-top: 1px solid #e9ecef;
          }

          @media (max-width: 768px) {
            .page-header {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }

            .filters-grid {
              grid-template-columns: 1fr;
            }

            .table-responsive {
              font-size: 14px;
            }

            .pagination {
              flex-direction: column;
              gap: 16px;
            }

            .modal {
              margin: 20px;
              max-height: calc(100vh - 40px);
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .modal-footer {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
  );
};

export default Inspections;
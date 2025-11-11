import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Save,
  Download
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const ExpirationDates = () => {
  const { hasPermission } = useContext(AuthContext);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    numeroInterno: '',
    placa: '',
    tipo: '',
    estado: '',
    diasVencimiento: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    vencidos: 0,
    proximosVencer: 0,
    vigentes: 0
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const fetchDates = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      });

      const response = await axios.get(`/api/dates?${params}`, config);
      setDates(response.data.dates || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching dates:', error);
      toast.error('Error al cargar fechas de vencimiento');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get('/api/dates/stats', config);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchDates();
    fetchStats();
  }, [fetchDates, fetchStats]);

  const handleCreateDate = () => {
    setModalMode('create');
    setSelectedDate(null);
    reset();
    setShowModal(true);
  };

  const handleEditDate = (date) => {
    setModalMode('edit');
    setSelectedDate(date);
    reset({
      numeroInterno: date.numeroInterno,
      placa: date.placa,
      tipo: date.tipo,
      fechaVencimiento: format(new Date(date.fechaVencimiento), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleViewDate = (date) => {
    setModalMode('view');
    setSelectedDate(date);
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (modalMode === 'create') {
        await axios.post('/api/dates', data, config);
        toast.success('Fecha de vencimiento creada exitosamente');
      } else if (modalMode === 'edit') {
        await axios.put(`/api/dates/${selectedDate._id}`, data, config);
        toast.success('Fecha de vencimiento actualizada exitosamente');
      }

      setShowModal(false);
      fetchDates();
      fetchStats();
    } catch (error) {
      console.error('Error saving date:', error);
      toast.error(error.response?.data?.message || 'Error al guardar fecha de vencimiento');
    }
  };

  const handleDeleteDate = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta fecha de vencimiento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`/api/dates/${id}`, config);
      toast.success('Fecha de vencimiento eliminada exitosamente');
      fetchDates();
      fetchStats();
    } catch (error) {
      console.error('Error deleting date:', error);
      toast.error('Error al eliminar fecha de vencimiento');
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
      tipo: '',
      estado: '',
      diasVencimiento: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getDateStatus = (fechaVencimiento) => {
    const today = new Date();
    const expirationDate = new Date(fechaVencimiento);
    const daysUntilExpiration = differenceInDays(expirationDate, today);

    if (daysUntilExpiration < 0) {
      return { status: 'expired', label: 'Vencido', color: 'danger', icon: AlertTriangle };
    } else if (daysUntilExpiration <= 7) {
      return { status: 'expiring', label: 'Próximo a vencer', color: 'warning', icon: Clock };
    } else {
      return { status: 'valid', label: 'Vigente', color: 'success', icon: CheckCircle };
    }
  };

  const exportDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      };

      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        export: 'true'
      });

      const response = await axios.get(`/api/dates/export?${params}`, config);
      
      // Crear y descargar archivo
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fechas_vencimiento_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Archivo exportado exitosamente');
    } catch (error) {
      console.error('Error exporting dates:', error);
      toast.error('Error al exportar fechas');
    }
  };

  if (loading && dates.length === 0) {
    return (
      <LoadingSpinner message="Cargando fechas de vencimiento..." />
    );
  }

  return (
    <div className="expiration-dates-page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">
                <Calendar size={28} />
                Fechas de Vencimiento
              </h1>
              <p className="page-subtitle">
                Gestiona las fechas de vencimiento de RTM, Revisiones Preventivas y SOAT
              </p>
            </div>
            <div className="header-actions">
              <button
                onClick={exportDates}
                className="btn btn-outline"
              >
                <Download size={20} />
                Exportar
              </button>
              {hasPermission(['Jefe de Mantenimiento', 'Jefe de Operaciones']) && (
                <button
                  onClick={handleCreateDate}
                  className="btn btn-primary"
                >
                  <Plus size={20} />
                  Nueva Fecha
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">
                <AlertTriangle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.vencidos}</div>
                <div className="stat-label">Vencidos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.proximosVencer}</div>
                <div className="stat-label">Próximos a Vencer</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.vigentes}</div>
                <div className="stat-label">Vigentes</div>
              </div>
            </div>
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
                  <label>Tipo</label>
                  <select
                    className="form-control"
                    value={filters.tipo}
                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="RTM">RTM</option>
                    <option value="Revisión Preventiva">Revisión Preventiva</option>
                    <option value="SOAT">SOAT</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Estado</label>
                  <select
                    className="form-control"
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="vigente">Vigente</option>
                    <option value="proximo">Próximo a vencer</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Días hasta vencimiento</label>
                  <select
                    className="form-control"
                    value={filters.diasVencimiento}
                    onChange={(e) => handleFilterChange('diasVencimiento', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="7">Próximos 7 días</option>
                    <option value="30">Próximos 30 días</option>
                    <option value="90">Próximos 90 días</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Dates Table */}
          <div className="table-container">
            {dates.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Vehículo</th>
                        <th>Tipo</th>
                        <th>Fecha de Vencimiento</th>
                        <th>Días Restantes</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dates.map((date) => {
                        const dateStatus = getDateStatus(date.fechaVencimiento);
                        const daysUntilExpiration = differenceInDays(new Date(date.fechaVencimiento), new Date());
                        const StatusIcon = dateStatus.icon;

                        return (
                          <tr key={date._id} className={`row-${dateStatus.status}`}>
                            <td>
                              <div className="vehicle-info">
                                <div className="vehicle-primary">
                                  {date.placa} - {date.vehiculo?.marca || 'N/A'}
                                </div>
                                <div className="vehicle-secondary">
                                  {date.numeroInterno} | {date.vehiculo?.tipo || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`type-badge ${date.tipo.toLowerCase().replace(' ', '-')}`}>
                                {date.tipo}
                              </span>
                            </td>
                            <td>
                              <div className="date-info">
                                <div className="date-primary">
                                  {format(new Date(date.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}
                                </div>
                                <div className="date-secondary">
                                  {format(new Date(date.fechaVencimiento), 'EEEE', { locale: es })}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`days-remaining ${dateStatus.color}`}>
                                {daysUntilExpiration < 0 
                                  ? `${Math.abs(daysUntilExpiration)} días vencido`
                                  : `${daysUntilExpiration} días`
                                }
                              </span>
                            </td>
                            <td>
                              <span className={`status ${dateStatus.color}`}>
                                <StatusIcon size={16} />
                                {dateStatus.label}
                              </span>
                            </td>
                            <td>
                              <div className="actions">
                                <button
                                  onClick={() => handleViewDate(date)}
                                  className="btn-icon"
                                  title="Ver detalles"
                                >
                                  <Eye size={16} />
                                </button>
                                {hasPermission(['Jefe de Mantenimiento', 'Jefe de Operaciones']) && (
                                  <>
                                    <button
                                      onClick={() => handleEditDate(date)}
                                      className="btn-icon"
                                      title="Editar"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDate(date._id)}
                                      className="btn-icon danger"
                                      title="Eliminar"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <div className="pagination-info">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} fechas
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
                <Calendar size={64} color="#e9ecef" />
                <h3>No hay fechas de vencimiento</h3>
                <p>Comienza agregando las fechas de vencimiento de tus vehículos</p>
                {hasPermission(['Jefe de Mantenimiento', 'Jefe de Operaciones']) && (
                  <button
                    onClick={handleCreateDate}
                    className="btn btn-primary"
                  >
                    <Plus size={20} />
                    Nueva Fecha
                  </button>
                )}
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
                  {modalMode === 'create' && 'Nueva Fecha de Vencimiento'}
                  {modalMode === 'edit' && 'Editar Fecha de Vencimiento'}
                  {modalMode === 'view' && 'Detalles de Fecha de Vencimiento'}
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
                  <div className="date-details">
                    <div className="detail-section">
                      <h4>Información del Vehículo</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Número Interno:</label>
                          <span>{selectedDate?.numeroInterno}</span>
                        </div>
                        <div className="detail-item">
                          <label>Placa:</label>
                          <span>{selectedDate?.placa}</span>
                        </div>
                        <div className="detail-item">
                          <label>Marca:</label>
                          <span>{selectedDate?.vehiculo?.marca || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Tipo:</label>
                          <span>{selectedDate?.vehiculo?.tipo || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Información de Vencimiento</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Tipo de Fecha:</label>
                          <span>{selectedDate?.tipo}</span>
                        </div>
                        <div className="detail-item">
                          <label>Fecha de Vencimiento:</label>
                          <span>{format(new Date(selectedDate?.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}</span>
                        </div>
                        <div className="detail-item">
                          <label>Estado:</label>
                          <span className={`status ${getDateStatus(selectedDate?.fechaVencimiento).color}`}>
                            {getDateStatus(selectedDate?.fechaVencimiento).label}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Días Restantes:</label>
                          <span>
                            {differenceInDays(new Date(selectedDate?.fechaVencimiento), new Date())} días
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="date-form">
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
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Información de Vencimiento</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Tipo *</label>
                          <select
                            className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                            {...register('tipo', {
                              required: 'El tipo es requerido'
                            })}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="RTM">RTM</option>
                            <option value="Revisión Preventiva">Revisión Preventiva</option>
                            <option value="SOAT">SOAT</option>
                          </select>
                          {errors.tipo && (
                            <div className="invalid-feedback">{errors.tipo.message}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Fecha de Vencimiento *</label>
                          <input
                            type="date"
                            className={`form-control ${errors.fechaVencimiento ? 'is-invalid' : ''}`}
                            {...register('fechaVencimiento', {
                              required: 'La fecha de vencimiento es requerida'
                            })}
                          />
                          {errors.fechaVencimiento && (
                            <div className="invalid-feedback">{errors.fechaVencimiento.message}</div>
                          )}
                        </div>
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
                        {modalMode === 'create' ? 'Crear Fecha' : 'Actualizar Fecha'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        <style jsx="true">{`
          .expiration-dates-page {
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

          .header-actions {
            display: flex;
            gap: 12px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }

          .stat-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .stat-icon.total {
            background-color: #007bff;
          }

          .stat-icon.danger {
            background-color: #dc3545;
          }

          .stat-icon.warning {
            background-color: #ffc107;
          }

          .stat-icon.success {
            background-color: #28a745;
          }

          .stat-content {
            flex: 1;
          }

          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            line-height: 1;
          }

          .stat-label {
            color: #6c757d;
            font-size: 14px;
            margin-top: 4px;
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

          .row-expired {
            background-color: rgba(220, 53, 69, 0.05);
          }

          .row-expiring {
            background-color: rgba(255, 193, 7, 0.05);
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

          .type-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .type-badge.rtm {
            background-color: #e3f2fd;
            color: #1976d2;
          }

          .type-badge.revisión-preventiva {
            background-color: #f3e5f5;
            color: #7b1fa2;
          }

          .type-badge.soat {
            background-color: #e8f5e8;
            color: #388e3c;
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
            text-transform: capitalize;
          }

          .days-remaining {
            font-weight: 600;
          }

          .days-remaining.success {
            color: #28a745;
          }

          .days-remaining.warning {
            color: #ffc107;
          }

          .days-remaining.danger {
            color: #dc3545;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 6px;
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

          .status.danger {
            background-color: #f8d7da;
            color: #721c24;
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
            max-width: 600px;
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

          .date-details {
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

          .date-form {
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

            .header-actions {
              flex-direction: column;
              width: 100%;
            }

            .stats-grid {
              grid-template-columns: 1fr;
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

export default ExpirationDates;
import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search as SearchIcon, 
  Filter, 
  Car,
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  X,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Search = () => {
  const [searchType, setSearchType] = useState('inspections'); // 'inspections', 'vehicles', 'dates'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    // Filtros generales
    numeroInterno: '',
    placa: '',
    fechaInicio: '',
    fechaFin: '',
    
    // Filtros específicos para inspecciones
    usuario: '',
    conObservaciones: '',
    
    // Filtros específicos para fechas de vencimiento
    tipo: '', // RTM, Revisión Preventiva, SOAT
    estado: '', // vigente, vencido, próximo a vencer
    
    // Filtros específicos para vehículos
    marca: '',
    tipoVehiculo: '',
    activo: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  const performSearch = useCallback(async () => {
    if (!hasActiveFilters()) {
      toast.error('Por favor, ingresa al menos un criterio de búsqueda');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Construir parámetros de búsqueda
      const searchParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      let endpoint = '';
      switch (searchType) {
        case 'inspections':
          endpoint = `/api/inspections/search?${searchParams}`;
          break;
        case 'vehicles':
          endpoint = `/api/vehicles/search?${searchParams}`;
          break;
        case 'dates':
          endpoint = `/api/dates/search?${searchParams}`;
          break;
        default:
          endpoint = `/api/inspections/search?${searchParams}`;
          break;
      }

      const response = await axios.get(endpoint, config);
      setResults(response.data.results || response.data.inspections || response.data.vehicles || response.data.dates || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      toast.error('Error al realizar la búsqueda');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [hasActiveFilters, searchType, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    if (hasActiveFilters()) {
      performSearch();
    }
  }, [hasActiveFilters, performSearch]);

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
      usuario: '',
      conObservaciones: '',
      tipo: '',
      estado: '',
      marca: '',
      tipoVehiculo: '',
      activo: ''
    });
    setResults([]);
    setPagination(prev => ({ ...prev, page: 1, total: 0, totalPages: 0 }));
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const exportResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      };

      const searchParams = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        export: 'true'
      });

      let endpoint = '';
      switch (searchType) {
        case 'inspections':
          endpoint = `/api/inspections/export?${searchParams}`;
          break;
        case 'vehicles':
          endpoint = `/api/vehicles/export?${searchParams}`;
          break;
        case 'dates':
          endpoint = `/api/dates/export?${searchParams}`;
          break;
        default:
          endpoint = `/api/inspections/export?${searchParams}`;
          break;
      }


      const response = await axios.get(endpoint, config);
      
      // Crear y descargar archivo
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${searchType}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Archivo exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar resultados');
    }
  };

  const renderSearchTypeSelector = () => (
    <div className="search-type-selector">
      <button
        onClick={() => setSearchType('inspections')}
        className={`type-btn ${searchType === 'inspections' ? 'active' : ''}`}
      >
        <FileText size={20} />
        Inspecciones
      </button>
      <button
        onClick={() => setSearchType('vehicles')}
        className={`type-btn ${searchType === 'vehicles' ? 'active' : ''}`}
      >
        <Car size={20} />
        Vehículos
      </button>
      <button
        onClick={() => setSearchType('dates')}
        className={`type-btn ${searchType === 'dates' ? 'active' : ''}`}
      >
        <Calendar size={20} />
        Fechas de Vencimiento
      </button>
    </div>
  );

  const renderFilters = () => (
    <div className="filters-section">
      <div className="filters-header">
        <h3>Filtros de Búsqueda</h3>
        <div className="filter-actions">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="btn btn-outline btn-sm"
          >
            <Filter size={16} />
            {showAdvancedFilters ? 'Filtros Básicos' : 'Filtros Avanzados'}
          </button>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="btn btn-outline btn-sm"
            >
              <X size={16} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="filters-grid">
        {/* Filtros básicos */}
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

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <>
            {searchType === 'inspections' && (
              <>
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

                <div className="filter-group">
                  <label>Con Observaciones</label>
                  <select
                    className="form-control"
                    value={filters.conObservaciones}
                    onChange={(e) => handleFilterChange('conObservaciones', e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="true">Con observaciones</option>
                    <option value="false">Sin observaciones</option>
                  </select>
                </div>
              </>
            )}

            {searchType === 'vehicles' && (
              <>
                <div className="filter-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por marca"
                    value={filters.marca}
                    onChange={(e) => handleFilterChange('marca', e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Tipo de Vehículo</label>
                  <select
                    className="form-control"
                    value={filters.tipoVehiculo}
                    onChange={(e) => handleFilterChange('tipoVehiculo', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Automóvil">Automóvil</option>
                    <option value="Bus">Bus</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Estado</label>
                  <select
                    className="form-control"
                    value={filters.activo}
                    onChange={(e) => handleFilterChange('activo', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </>
            )}

            {searchType === 'dates' && (
              <>
                <div className="filter-group">
                  <label>Tipo de Fecha</label>
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
                    <option value="vencido">Vencido</option>
                    <option value="proximo">Próximo a vencer</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="search-actions">
        <button
          onClick={performSearch}
          className="btn btn-primary"
          disabled={loading || !hasActiveFilters()}
        >
          <SearchIcon size={16} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        {results.length > 0 && (
          <button
            onClick={exportResults}
            className="btn btn-outline"
          >
            <Download size={16} />
            Exportar
          </button>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    if (loading) {
      return <LoadingSpinner message="Realizando búsqueda..." />;
    }

    if (!hasActiveFilters()) {
      return (
        <div className="search-placeholder">
          <SearchIcon size={64} color="#e9ecef" />
          <h3>Búsqueda Avanzada</h3>
          <p>Utiliza los filtros para encontrar la información que necesitas</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="no-results">
          <AlertTriangle size={64} color="#e9ecef" />
          <h3>No se encontraron resultados</h3>
          <p>Intenta ajustar los criterios de búsqueda</p>
        </div>
      );
    }

    return (
      <div className="results-section">
        <div className="results-header">
          <h3>Resultados de Búsqueda</h3>
          <span className="results-count">
            {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="results-grid">
          {results.map((item, index) => (
            <div key={item._id || index} className="result-card">
              {searchType === 'inspections' && (
                <>
                  <div className="card-header">
                    <div className="card-icon">
                      <FileText size={24} />
                    </div>
                    <div className="card-title">
                      <h4>Inspección - {item.placa}</h4>
                      <span className="card-subtitle">{item.numeroInterno}</span>
                    </div>
                    <div className={`status ${item.detallesEncontrados ? 'warning' : 'success'}`}>
                      {item.detallesEncontrados ? 'Con observaciones' : 'Sin observaciones'}
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <Calendar size={16} />
                      <span>{safeFormatDate(item.fechaInspeccion, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="info-row">
                      <User size={16} />
                      <span>{item.usuario?.nombres || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <Car size={16} />
                      <span>{item.marca} {item.modelo} - {item.kilometraje?.toLocaleString()} km</span>
                    </div>
                  </div>
                </>
              )}

              {searchType === 'vehicles' && (
                <>
                  <div className="card-header">
                    <div className="card-icon">
                      <Car size={24} />
                    </div>
                    <div className="card-title">
                      <h4>{item.placa} - {item.marca}</h4>
                      <span className="card-subtitle">{item.numeroInterno}</span>
                    </div>
                    <div className={`status ${item.activo ? 'success' : 'danger'}`}>
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span><strong>Tipo:</strong> {item.tipo}</span>
                    </div>
                    <div className="info-row">
                      <span><strong>Modelo:</strong> {item.modelo}</span>
                    </div>
                    <div className="info-row">
                      <span><strong>Año:</strong> {item.año}</span>
                    </div>
                  </div>
                </>
              )}

              {searchType === 'dates' && (
                <>
                  <div className="card-header">
                    <div className="card-icon">
                      <Calendar size={24} />
                    </div>
                    <div className="card-title">
                      <h4>{item.tipo} - {item.placa}</h4>
                      <span className="card-subtitle">{item.numeroInterno}</span>
                    </div>
                    {(() => {
                      const fv = toValidDate(item.fechaVencimiento);
                      const now = new Date();
                      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                      const statusClass = !fv ? 'neutral' : (fv < now ? 'danger' : (fv <= nextWeek ? 'warning' : 'success'));
                      const statusText = !fv ? 'Sin fecha' : (fv < now ? 'Vencido' : (fv <= nextWeek ? 'Próximo a vencer' : 'Vigente'));
                      return (
                        <div className={`status ${statusClass}`}>
                          {statusText}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <Calendar size={16} />
                      <span><strong>Vence:</strong> {safeFormatDate(item.fechaVencimiento, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="info-row">
                      <Car size={16} />
                      <span>{item.vehiculo?.marca} {item.vehiculo?.modelo}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="card-actions">
                <button
                  onClick={() => handleViewDetails(item)}
                  className="btn btn-outline btn-sm"
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} resultados
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
        )}
      </div>
    );
  };

  return (
    <div className="search-page">
        <div className="container">
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">
                <SearchIcon size={28} />
                Búsqueda Avanzada
              </h1>
              <p className="page-subtitle">
                Encuentra información específica usando filtros personalizados
              </p>
            </div>
          </div>

          {renderSearchTypeSelector()}
          {renderFilters()}
          {renderResults()}
        </div>

        {/* Modal de detalles */}
        {showModal && selectedItem && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">Detalles del Resultado</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <pre className="details-content">
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <style jsx="true">{`
          .search-page {
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

          .search-type-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            background: white;
            padding: 8px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .type-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.2s ease;
          }

          .type-btn:hover {
            background-color: #f8f9fa;
            color: #007bff;
          }

          .type-btn.active {
            background-color: #007bff;
            color: white;
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

          .filters-header h3 {
            color: #333;
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .filter-actions {
            display: flex;
            gap: 8px;
          }

          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
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

          .search-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }

          .search-placeholder,
          .no-results {
            text-align: center;
            padding: 80px 20px;
            color: #6c757d;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .search-placeholder h3,
          .no-results h3 {
            margin: 24px 0 16px;
            color: #333;
          }

          .results-section {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e9ecef;
          }

          .results-header h3 {
            color: #333;
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .results-count {
            color: #6c757d;
            font-size: 14px;
          }

          .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
          }

          .result-card {
            border: 1px solid #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.2s ease;
          }

          .result-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }

          .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .card-icon {
            color: #007bff;
          }

          .card-title {
            flex: 1;
          }

          .card-title h4 {
            margin: 0 0 4px;
            font-size: 1rem;
            font-weight: 600;
            color: #333;
          }

          .card-subtitle {
            font-size: 12px;
            color: #6c757d;
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

          .status.danger {
            background-color: #f8d7da;
            color: #721c24;
          }

          .card-content {
            padding: 16px;
          }

          .info-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #6c757d;
            font-size: 14px;
          }

          .info-row:last-child {
            margin-bottom: 0;
          }

          .card-actions {
            padding: 16px;
            border-top: 1px solid #e9ecef;
            background-color: #f8f9fa;
          }

          .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
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
            max-height: 80vh;
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

          .details-content {
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
            color: #333;
          }

          @media (max-width: 768px) {
            .search-type-selector {
              flex-direction: column;
            }

            .filters-grid {
              grid-template-columns: 1fr;
            }

            .results-grid {
              grid-template-columns: 1fr;
            }

            .pagination {
              flex-direction: column;
              gap: 16px;
            }

            .modal {
              margin: 20px;
              max-height: calc(100vh - 40px);
            }

            .search-actions {
              flex-direction: column;
            }

            .results-header {
              flex-direction: column;
              gap: 8px;
              text-align: center;
            }
          }
        `}</style>
      </div>
  );
};

export default Search;
// Utilidades de fecha seguras
const toValidDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const safeFormatDate = (value, fmt = 'dd/MM/yyyy') => {
  const d = toValidDate(value);
  return d ? format(d, fmt, { locale: es }) : 'N/A';
};
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  Bell, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  Plus
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInspections: 0,
    pendingNotifications: 0,
    expiredDates: 0,
    activeVehicles: 0
  });
  const [recentInspections, setRecentInspections] = useState([]);
  const [upcomingExpirations, setUpcomingExpirations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Obtener estadísticas básicas
      const [inspectionsRes, notificationsRes, datesRes, vehiclesRes] = await Promise.all([
        axios.get('/api/inspections?limit=5', config),
        axios.get('/api/notifications/pending', config),
        axios.get('/api/dates?expired=true', config),
        axios.get('/api/vehicles', config)
      ]);

      setStats({
        totalInspections: inspectionsRes.data.total || 0,
        pendingNotifications: notificationsRes.data.length || 0,
        expiredDates: datesRes.data.length || 0,
        activeVehicles: vehiclesRes.data.length || 0
      });

      setRecentInspections(inspectionsRes.data.inspections || []);
      setUpcomingExpirations(notificationsRes.data.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Nueva Inspección',
      description: 'Registrar inspección preoperacional',
      icon: Plus,
      href: '/inspections/new',
      color: '#007bff',
      permission: ['Tecnico', 'Jefe de Mantenimiento', 'Jefe de Operaciones', 'Administrador']
    },
    {
      title: 'Buscar Información',
      description: 'Buscar inspecciones y vehículos',
      icon: Search,
      href: '/search',
      color: '#28a745',
      permission: ['Jefe de Mantenimiento', 'Jefe de Operaciones', 'Administrador']
    },
    {
      title: 'Gestionar Fechas',
      description: 'Actualizar fechas de vencimiento',
      icon: Calendar,
      href: '/dates',
      color: '#ffc107',
      permission: ['Jefe de Mantenimiento', 'Jefe de Operaciones', 'Administrador']
    },
    {
      title: 'Ver Notificaciones',
      description: 'Revisar alertas y notificaciones',
      icon: Bell,
      href: '/notifications',
      color: '#dc3545',
      permission: ['Jefe de Mantenimiento', 'Jefe de Operaciones', 'Administrador']
    }
  ];

  const statCards = [
    {
      title: 'Inspecciones Totales',
      value: stats.totalInspections,
      icon: ClipboardList,
      color: '#007bff',
      trend: '+12%'
    },
    {
      title: 'Vehículos Activos',
      value: stats.activeVehicles,
      icon: Car,
      color: '#28a745',
      trend: '+5%'
    },
    {
      title: 'Fechas Vencidas',
      value: stats.expiredDates,
      icon: AlertTriangle,
      color: '#dc3545',
      trend: '-8%'
    },
    {
      title: 'Notificaciones Pendientes',
      value: stats.pendingNotifications,
      icon: Bell,
      color: '#ffc107',
      trend: '+3%'
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <div className="dashboard">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1 className="dashboard-title">
                ¡Bienvenido, {user?.nombres}!
              </h1>
              <p className="dashboard-subtitle">
                Aquí tienes un resumen de la actividad de MantenimientoExprés
              </p>
            </div>
            <div className="header-stats">
              <div className="current-time">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    <Icon size={24} color="white" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-trend" style={{ color: stat.color }}>
                      {stat.trend} este mes
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="section">
            <h2 className="section-title">Acciones Rápidas</h2>
            <div className="actions-grid">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const hasPermission = action.permission.includes(user?.cargo);
                
                if (!hasPermission) return null;

                return (
                  <Link key={index} to={action.href} className="action-card">
                    <div className="action-icon" style={{ backgroundColor: action.color }}>
                      <Icon size={24} color="white" />
                    </div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-grid">
            {/* Recent Inspections */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <ClipboardList size={20} />
                  Inspecciones Recientes
                </h3>
                <Link to="/inspections" className="card-link">
                  Ver todas
                </Link>
              </div>
              <div className="card-content">
                {recentInspections.length > 0 ? (
                  <div className="list">
                    {recentInspections.map((inspection) => (
                      <div key={inspection._id} className="list-item">
                        <div className="item-icon">
                          <Car size={16} color="#007bff" />
                        </div>
                        <div className="item-content">
                          <div className="item-title">
                            {inspection.placa} - {inspection.marca}
                          </div>
                          <div className="item-subtitle">
                            {new Date(inspection.fechaInspeccion).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div className="item-status">
                          <CheckCircle size={16} color="#28a745" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <ClipboardList size={48} color="#e9ecef" />
                    <p>No hay inspecciones recientes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Expirations */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertTriangle size={20} />
                  Próximos Vencimientos
                </h3>
                <Link to="/dates" className="card-link">
                  Ver todos
                </Link>
              </div>
              <div className="card-content">
                {upcomingExpirations.length > 0 ? (
                  <div className="list">
                    {upcomingExpirations.map((expiration) => (
                      <div key={expiration._id} className="list-item">
                        <div className="item-icon">
                          <Clock size={16} color="#ffc107" />
                        </div>
                        <div className="item-content">
                          <div className="item-title">
                            {expiration.placa} - {expiration.tipo}
                          </div>
                          <div className="item-subtitle">
                            Vence: {new Date(expiration.fechaVencimiento).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div className="item-status">
                          <AlertTriangle size={16} color="#dc3545" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Calendar size={48} color="#e9ecef" />
                    <p>No hay vencimientos próximos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx="true">{`
          .dashboard {
            min-height: calc(100vh - 70px);
            background-color: #f8f9fa;
            padding: 32px 20px;
          }

          .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding: 24px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
          }

          .dashboard-subtitle {
            color: #6c757d;
            font-size: 1rem;
          }

          .current-time {
            color: #6c757d;
            font-size: 14px;
            text-transform: capitalize;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
          }

          .stat-card {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 16px;
            transition: transform 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
          }

          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 4px;
          }

          .stat-title {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .stat-trend {
            font-size: 12px;
            font-weight: 600;
          }

          .section {
            margin-bottom: 32px;
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
          }

          .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }

          .action-card {
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.2s ease;
          }

          .action-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            text-decoration: none;
            color: inherit;
          }

          .action-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .action-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .action-description {
            color: #6c757d;
            font-size: 14px;
            margin: 0;
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .dashboard-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .card-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .card-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin: 0;
          }

          .card-link {
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
          }

          .card-link:hover {
            text-decoration: underline;
          }

          .card-content {
            padding: 24px;
          }

          .list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .list-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }

          .item-icon {
            width: 32px;
            height: 32px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .item-content {
            flex: 1;
          }

          .item-title {
            font-weight: 600;
            color: #333;
            font-size: 14px;
            margin-bottom: 2px;
          }

          .item-subtitle {
            color: #6c757d;
            font-size: 12px;
          }

          .item-status {
            flex-shrink: 0;
          }

          .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
          }

          .empty-state p {
            margin-top: 16px;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .dashboard {
              padding: 20px 16px;
            }

            .dashboard-header {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }

            .dashboard-title {
              font-size: 1.5rem;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .actions-grid {
              grid-template-columns: 1fr;
            }

            .dashboard-grid {
              grid-template-columns: 1fr;
            }

            .action-card {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>
    </div>
  );
};

export default Dashboard;
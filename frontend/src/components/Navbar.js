import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  ClipboardList, 
  Search, 
  Calendar, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Inspecciones', href: '/inspections', icon: ClipboardList },
    { name: 'Búsqueda', href: '/search', icon: Search },
    { name: 'Fechas de Vencimiento', href: '/dates', icon: Calendar },
    { name: 'Notificaciones', href: '/notifications', icon: Bell },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo y título */}
          <div className="navbar-brand">
            <Link to="/dashboard" className="brand-link">
              <div className="brand-icon">🚗</div>
              <span className="brand-text">MantenimientoExprés</span>
            </Link>
          </div>

          {/* Navegación desktop */}
          <div className="navbar-nav desktop-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y menú móvil */}
          <div className="navbar-actions">
            <div className="user-info desktop-only">
              <User size={18} />
              <span>{user?.nombres}</span>
              <span className="user-role">({user?.cargo})</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn btn-outline btn-sm desktop-only"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>

            {/* Botón menú móvil */}
            <button
              className="mobile-menu-btn mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-user-info">
              <User size={20} />
              <div>
                <div className="user-name">{user?.nombres}</div>
                <div className="user-role">{user?.cargo}</div>
              </div>
            </div>
            
            <div className="mobile-nav">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn btn-danger btn-sm mobile-logout"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </nav>

      <style jsx="true">{`
        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .navbar-brand {
          flex-shrink: 0;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #333;
          font-weight: 600;
          font-size: 18px;
        }

        .brand-icon {
          font-size: 24px;
        }

        .brand-text {
          color: #007bff;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          text-decoration: none;
          color: #6c757d;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
        }

        .nav-link:hover {
          background-color: #f8f9fa;
          color: #007bff;
        }

        .nav-link.active {
          background-color: #007bff;
          color: white;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 14px;
        }

        .user-role {
          font-size: 12px;
          opacity: 0.8;
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background-color: #f8f9fa;
        }

        .mobile-menu {
          background: white;
          border-top: 1px solid #e9ecef;
          padding: 20px;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .user-name {
          font-weight: 600;
          color: #333;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #6c757d;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .mobile-nav-link:hover {
          background-color: #f8f9fa;
          color: #007bff;
        }

        .mobile-nav-link.active {
          background-color: #007bff;
          color: white;
        }

        .mobile-logout {
          width: 100%;
          justify-content: center;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-nav,
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
          }

          .navbar-container {
            padding: 0 16px;
          }

          .brand-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
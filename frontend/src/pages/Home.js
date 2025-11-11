import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  Bell, 
  Shield, 
  Zap,
  CheckCircle,
  Users
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Inspecciones Preoperacionales',
      description: 'Registra y gestiona inspecciones de vehículos de manera eficiente',
      color: '#007bff'
    },
    {
      icon: Search,
      title: 'Búsqueda Avanzada',
      description: 'Encuentra información rápidamente con filtros inteligentes',
      color: '#28a745'
    },
    {
      icon: Calendar,
      title: 'Control de Vencimientos',
      description: 'Gestiona fechas de RTM, revisiones preventivas y SOAT',
      color: '#ffc107'
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Recibe alertas automáticas sobre vencimientos próximos',
      color: '#dc3545'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'Mantén tus vehículos seguros con inspecciones regulares'
    },
    {
      icon: Zap,
      title: 'Eficiencia',
      description: 'Optimiza el tiempo de gestión de mantenimiento'
    },
    {
      icon: CheckCircle,
      title: 'Cumplimiento',
      description: 'Asegura el cumplimiento de normativas vigentes'
    },
    {
      icon: Users,
      title: 'Colaboración',
      description: 'Facilita el trabajo en equipo entre departamentos'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              MantenimientoExprés
              <span className="hero-subtitle">Sistema de Gestión Vehicular</span>
            </h1>
            <p className="hero-description">
              Optimiza el mantenimiento de tu flota vehicular con nuestro sistema integral 
              de inspecciones preoperacionales, control de vencimientos y notificaciones automáticas.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Registrarse
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon">🚗</div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Digital</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Disponible</div>
              </div>
              <div className="stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Papel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Funcionalidades Principales</h2>
            <p>Todo lo que necesitas para gestionar tu flota vehicular</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                    <Icon size={32} color="white" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="section-header">
            <h2>¿Por qué elegir MantenimientoExprés?</h2>
            <p>Beneficios que transformarán tu gestión vehicular</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">
                    <Icon size={24} color="#007bff" />
                  </div>
                  <div className="benefit-content">
                    <h4 className="benefit-title">{benefit.title}</h4>
                    <p className="benefit-description">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para comenzar?</h2>
            <p>Únete a MantenimientoExprés y transforma la gestión de tu flota vehicular</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .home-page {
          min-height: 100vh;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 20px;
          min-height: 600px;
          display: flex;
          align-items: center;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .hero-subtitle {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          opacity: 0.9;
          margin-top: 8px;
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .hero-icon {
          font-size: 120px;
          animation: float 3s ease-in-out infinite;
        }

        .hero-stats {
          display: flex;
          gap: 32px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .features {
          padding: 80px 20px;
          background-color: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #333;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #6c757d;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .feature-description {
          color: #6c757d;
          line-height: 1.6;
        }

        .benefits {
          padding: 80px 20px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .benefit-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background-color: #e3f2fd;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefit-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        .benefit-description {
          color: #6c757d;
          line-height: 1.6;
        }

        .cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 20px;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .features-grid,
          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .benefit-item {
            flex-direction: column;
            text-align: center;
          }

          .cta-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
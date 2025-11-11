import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Iniciando sesión..." />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <LogIn size={32} color="#007bff" />
            </div>
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Accede a MantenimientoExprés</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="tu@email.com"
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Contraseña
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Tu contraseña"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="link-primary">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-content">
            <h2>MantenimientoExprés</h2>
            <p>
              Sistema integral para la gestión de inspecciones preoperacionales 
              y control de vencimientos vehiculares.
            </p>
            <div className="info-features">
              <div className="info-feature">
                <div className="feature-icon">✓</div>
                <span>Inspecciones digitales</span>
              </div>
              <div className="info-feature">
                <div className="feature-icon">✓</div>
                <span>Notificaciones automáticas</span>
              </div>
              <div className="info-feature">
                <div className="feature-icon">✓</div>
                <span>Control de vencimientos</span>
              </div>
              <div className="info-feature">
                <div className="feature-icon">✓</div>
                <span>Búsqueda avanzada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .login-card {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          width: 80px;
          height: 80px;
          background: #e3f2fd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #6c757d;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 14px;
          margin-top: 4px;
        }

        .btn-block {
          width: 100%;
          margin-top: 16px;
        }

        .login-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
        }

        .link-primary {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
        }

        .link-primary:hover {
          text-decoration: underline;
        }

        .login-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-content {
          text-align: center;
        }

        .info-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .info-content p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .info-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-start;
        }

        .info-feature {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 400px;
          }

          .login-info {
            order: -1;
            padding: 40px 20px;
          }

          .login-card {
            padding: 40px 20px;
          }

          .info-content h2 {
            font-size: 2rem;
          }

          .info-features {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
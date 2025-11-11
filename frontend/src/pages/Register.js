import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Briefcase } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const roles = [
    'Tecnico',
    'Jefe de Mantenimiento',
    'Jefe de Operaciones',
    'Administrador'
  ];

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('¡Registro exitoso! Bienvenido a MantenimientoExprés');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Error al registrar usuario');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Registrando usuario..." />;
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-info">
          <div className="info-content">
            <h2>¡Únete a MantenimientoExprés!</h2>
            <p>
              Crea tu cuenta y comienza a gestionar tu flota vehicular 
              de manera eficiente y profesional.
            </p>
            <div className="info-stats">
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Seguro</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Disponible</div>
              </div>
              <div className="stat">
                <div className="stat-number">∞</div>
                <div className="stat-label">Vehículos</div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">
              <UserPlus size={32} color="#007bff" />
            </div>
            <h1 className="register-title">Crear Cuenta</h1>
            <p className="register-subtitle">Completa tus datos para comenzar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombres" className="form-label">
                  <User size={16} />
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombres"
                  className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                  placeholder="Tus nombres"
                  {...register('nombres', {
                    required: 'Los nombres son requeridos',
                    minLength: {
                      value: 2,
                      message: 'Los nombres deben tener al menos 2 caracteres'
                    }
                  })}
                />
                {errors.nombres && (
                  <div className="invalid-feedback">{errors.nombres.message}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cargo" className="form-label">
                  <Briefcase size={16} />
                  Cargo
                </label>
                <select
                  id="cargo"
                  className={`form-control ${errors.cargo ? 'is-invalid' : ''}`}
                  {...register('cargo', {
                    required: 'El cargo es requerido'
                  })}
                >
                  <option value="">Selecciona tu cargo</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.cargo && (
                  <div className="invalid-feedback">{errors.cargo.message}</div>
                )}
              </div>
            </div>

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

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <Lock size={16} />
                  Confirmar Contraseña
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirma tu contraseña"
                    {...register('confirmPassword', {
                      required: 'Debes confirmar tu contraseña',
                      validate: value =>
                        value === password || 'Las contraseñas no coinciden'
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="link-primary">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .register-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .register-info {
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

        .info-stats {
          display: flex;
          justify-content: center;
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

        .register-card {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
        }

        .register-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-icon {
          width: 80px;
          height: 80px;
          background: #e3f2fd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .register-subtitle {
          color: #6c757d;
          font-size: 1rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

        .register-footer {
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

        @media (max-width: 768px) {
          .register-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .register-info {
            order: -1;
            padding: 40px 20px;
          }

          .register-card {
            padding: 40px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .info-content h2 {
            font-size: 2rem;
          }

          .info-stats {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
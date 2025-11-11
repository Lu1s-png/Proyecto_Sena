import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
      
      <style jsx="true">{`
        .loading-spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          width: 100%;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .w-6 { width: 24px; height: 24px; }
        .w-12 { width: 48px; height: 48px; }
        .w-16 { width: 64px; height: 64px; }
        
        .loading-message {
          color: #6c757d;
          font-size: 14px;
          margin: 0;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
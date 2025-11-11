import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error('No hay token de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/notifications?page=1&limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
          toast.success('Notificaciones cargadas correctamente');
        } else {
          const errorText = await response.text();
          toast.error(`Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        toast.error(`Error de conexión: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Notificaciones</h1>
      
      {notifications.length > 0 ? (
        <div>
          <h2>Lista de Notificaciones:</h2>
          {notifications.map((notification, index) => (
            <div key={index} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              <p><strong>Tipo:</strong> {notification.tipo}</p>
              <p><strong>Vehículo:</strong> {notification.vehiculo?.numeroInterno || 'N/A'}</p>
              <p><strong>Fecha Vencimiento:</strong> {new Date(notification.fechaVencimiento).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay notificaciones disponibles</p>
      )}
    </div>
  );
};

export default Notifications;
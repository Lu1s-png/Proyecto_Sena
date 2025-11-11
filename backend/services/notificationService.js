const nodemailer = require('nodemailer');
const ExpirationDate = require('../models/ExpirationDate');
const User = require('../models/User');

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar email de notificación
const sendNotificationEmail = async (userEmail, userName, vehicleInfo, expirationInfo) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🚨 Notificación de Vencimiento - ${expirationInfo.tipo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h2 style="color: #dc3545; text-align: center;">⚠️ Notificación de Vencimiento</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057;">Hola ${userName},</h3>
              
              <p style="color: #6c757d; font-size: 16px;">
                Te informamos que el siguiente vehículo tiene una fecha de vencimiento próxima:
              </p>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">Información del Vehículo:</h4>
                <ul style="color: #856404; margin: 0; padding-left: 20px;">
                  <li><strong>Número Interno:</strong> ${vehicleInfo.numeroInterno}</li>
                  <li><strong>Placa:</strong> ${vehicleInfo.placa}</li>
                  <li><strong>Marca:</strong> ${vehicleInfo.marca}</li>
                  <li><strong>Tipo:</strong> ${vehicleInfo.tipo}</li>
                  <li><strong>Modelo:</strong> ${vehicleInfo.modelo}</li>
                </ul>
              </div>
              
              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h4 style="color: #721c24; margin: 0 0 10px 0;">Información de Vencimiento:</h4>
                <ul style="color: #721c24; margin: 0; padding-left: 20px;">
                  <li><strong>Tipo:</strong> ${expirationInfo.tipo}</li>
                  <li><strong>Fecha de Vencimiento:</strong> ${new Date(expirationInfo.fechaVencimiento).toLocaleDateString('es-CO')}</li>
                  <li><strong>Días Restantes:</strong> ${Math.ceil((new Date(expirationInfo.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24))} días</li>
                </ul>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; margin-top: 20px;">
                Por favor, toma las medidas necesarias para renovar o actualizar esta información antes de la fecha de vencimiento.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6c757d; font-size: 12px;">
                  Este es un mensaje automático del sistema MantenimientoExprés.<br>
                  No responder a este correo.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notificación enviada a ${userEmail} para vehículo ${vehicleInfo.placa}`);
    return true;
  } catch (error) {
    console.error('Error enviando notificación por email:', error);
    return false;
  }
};

// Función principal para verificar fechas de vencimiento
const checkExpiringDates = async () => {
  try {
    console.log('Iniciando verificación de fechas de vencimiento...');
    
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    // Buscar fechas que vencen en los próximos 2 días y no han sido notificadas
    const expiringDates = await ExpirationDate.find({
      fechaVencimiento: {
        $gte: today,
        $lte: twoDaysFromNow
      },
      notificacionEnviada: false,
      activo: true
    })
    .populate('vehiculo')
    .populate('usuario', 'nombres email cargo');

    console.log(`Encontradas ${expiringDates.length} fechas próximas a vencer`);

    // Obtener todos los usuarios que deben recibir notificaciones
    const notificationUsers = await User.find({
      cargo: { $in: ['Jefe de Mantenimiento', 'Jefe de Operaciones'] },
      activo: true
    });

    for (const expirationDate of expiringDates) {
      const vehicleInfo = {
        numeroInterno: expirationDate.numeroInterno,
        placa: expirationDate.placa,
        marca: expirationDate.vehiculo?.marca || 'N/A',
        tipo: expirationDate.vehiculo?.tipo || 'N/A',
        modelo: expirationDate.vehiculo?.modelo || 'N/A'
      };

      const expirationInfo = {
        tipo: expirationDate.tipo,
        fechaVencimiento: expirationDate.fechaVencimiento
      };

      // Enviar notificación a usuarios autorizados
      let notificationSent = false;
      
      for (const user of notificationUsers) {
        const emailSent = await sendNotificationEmail(
          user.email,
          user.nombres,
          vehicleInfo,
          expirationInfo
        );
        
        if (emailSent) {
          notificationSent = true;
        }
      }

      // Marcar como notificado si se envió al menos un email
      if (notificationSent) {
        await ExpirationDate.findByIdAndUpdate(expirationDate._id, {
          notificacionEnviada: true,
          fechaNotificacion: new Date()
        });
        
        console.log(`Notificación marcada como enviada para ${vehicleInfo.placa} - ${expirationInfo.tipo}`);
      }
    }

    console.log('Verificación de fechas de vencimiento completada');
  } catch (error) {
    console.error('Error en verificación de fechas de vencimiento:', error);
  }
};

// Función para enviar notificación manual
const sendManualNotification = async (expirationDateId) => {
  try {
    const expirationDate = await ExpirationDate.findById(expirationDateId)
      .populate('vehiculo')
      .populate('usuario', 'nombres email cargo');

    if (!expirationDate) {
      throw new Error('Fecha de vencimiento no encontrada');
    }

    const vehicleInfo = {
      numeroInterno: expirationDate.numeroInterno,
      placa: expirationDate.placa,
      marca: expirationDate.vehiculo?.marca || 'N/A',
      tipo: expirationDate.vehiculo?.tipo || 'N/A',
      modelo: expirationDate.vehiculo?.modelo || 'N/A'
    };

    const expirationInfo = {
      tipo: expirationDate.tipo,
      fechaVencimiento: expirationDate.fechaVencimiento
    };

    // Obtener usuarios para notificar
    const notificationUsers = await User.find({
      cargo: { $in: ['Jefe de Mantenimiento', 'Jefe de Operaciones'] },
      activo: true
    });

    let notificationSent = false;
    
    for (const user of notificationUsers) {
      const emailSent = await sendNotificationEmail(
        user.email,
        user.nombres,
        vehicleInfo,
        expirationInfo
      );
      
      if (emailSent) {
        notificationSent = true;
      }
    }

    if (notificationSent) {
      await ExpirationDate.findByIdAndUpdate(expirationDateId, {
        notificacionEnviada: true,
        fechaNotificacion: new Date()
      });
    }

    return notificationSent;
  } catch (error) {
    console.error('Error enviando notificación manual:', error);
    throw error;
  }
};

module.exports = {
  checkExpiringDates,
  sendManualNotification,
  sendNotificationEmail
};
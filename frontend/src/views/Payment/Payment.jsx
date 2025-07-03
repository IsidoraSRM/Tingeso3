import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentTable from '../../components/PaymentTable/PaymentTable';
import { Button, Snackbar, Alert, Box } from '@mui/material';
import reservationService from '../../services/reservation';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reservationId = state?.reservationId;
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleConfirmation = async () => {
    if (!reservationId) {
      setNotification({
        open: true,
        message: 'No se encontró ID de reserva',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await reservationService.sendConfirmationEmail(reservationId);
      setNotification({
        open: true,
        message: 'Reserva confirmada. Se ha enviado un correo de confirmación.',
        severity: 'success'
      });
      //  redirigir al usuario a otra página después de 2 segundos
      setTimeout(() => navigate('/'), 30000); // esperar 30 segundos antes de redirigir
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
      setNotification({
        open: true,
        message: 'Error al confirmar la reserva: ' + (error.response?.data?.error || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div>
      
      <PaymentTable reservationId={reservationId} />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3, marginLeft: 2, padding: 2, gap: 3 }}>
        <Button
          variant="contained" 
          onClick={() => navigate('/')} 
          disableElevation
          disableRipple
          
          
          sx={{ 
            minWidth: 200,
            backgroundColor: loading ? '#C98F51' : '#77B8B9',
            color: '#F4F5F5',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: loading ? '#77B8B9' : '#C98F51',
            },
            '&:active': {
              backgroundColor: loading ? '#77B8B9' : '#C98F51',
              opacity: 1
            }
            
          }}>
          Volver al Inicio 
        </Button>
        <Button 
          variant="contained" 
          onClick={handleConfirmation} 
          disabled={loading || !reservationId}
          disableElevation
          disableRipple
          sx={{ 
            minWidth: 200,
            backgroundColor: loading ? '#C98F51' : '#77B8B9',
            color: '#F4F5F5',
            fontWeight: 'bold',
            padding: loading ? '12px 24px' : '10px 20px',
            borderRadius: loading ? '25px' : '4px',
            fontSize: loading ? '16px' : '14px',
            letterSpacing: loading ? '1px' : 'normal',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: loading ? '#77B8B9' : '#C98F51',
            },
            '&:active': {
              backgroundColor: loading ? '#77B8B9' : '#C98F51',
              opacity: 1
            }
          }}
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </Button>
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Payment;
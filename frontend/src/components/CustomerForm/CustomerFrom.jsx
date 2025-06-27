import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Alert, Snackbar, Stepper, Step, StepLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import httpCommon from '../../http-common';
import tariffService from '../../services/tariff';
import reservationService from '../../services/reservation';
import './CustomerFrom.css';
import PaymentTable from '../PaymentTable/PaymentTable';

const steps = ['Datos Reserva', 'Datos Clientes', 'Confirmar'];

const CustomerFrom = () => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    duration: '', 
    groupSize: 1,
    customers: [
      {
        name: '',
        lastname: '',
        rut: '',
        email: '',
        phone: '',
        birthdate: '',
      },
    ],
  });
  const [activeStep, setActiveStep] = useState(0);
  const [tariffs, setTariffs] = useState([]);
  const [reservationId, setReservationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await tariffService.getAll();
        setTariffs(response.data);
      } catch (error) {
        console.error('Error al obtener las tarifas:', error);
      }
    };
    fetchTariffs();
  }, []);
  const [loading, setLoading] = useState(false);

const handleConfirmation = async () => {
  setLoading(true);
  try {
    await reservationService.sendConfirmationEmail(reservationId);
    setNotification({
      open: true,
      message: '¡Reserva confirmada exitosamente!',
      severity: 'success'
    });
    // Opcional: puedes redirigir o resetear el formulario aquí
  } catch (error) {
    setNotification({
      open: true,
      message: 'Error al confirmar la reserva',
      severity: 'error'
    });
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'groupSize') {
      const newGroupSize = parseInt(value, 10) || 1;
      const updatedCustomers = [...formData.customers];
      if (newGroupSize > updatedCustomers.length) {
        for (let i = updatedCustomers.length; i < newGroupSize; i++) {
          updatedCustomers.push({
            name: '',
            lastname: '',
            rut: '',
            email: '',
            phone: '',
            birthdate: '',
          });
        }
      } else if (newGroupSize < updatedCustomers.length) {
        updatedCustomers.splice(newGroupSize);
      }
      setFormData({ ...formData, groupSize: newGroupSize, customers: updatedCustomers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCustomerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCustomers = [...formData.customers];
    updatedCustomers[index][name] = value;
    setFormData({ ...formData, customers: updatedCustomers });
  };

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'error' 
  });
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Validación simple por paso
  const isStepValid = () => {
    if (activeStep === 0) {
      return formData.date && formData.duration && formData.startTime && formData.groupSize;
    }
    if (activeStep === 1) {
      return formData.customers.every(
        c => c.name && c.lastname && c.rut && c.email && c.phone && c.birthdate
      );
    }
    return true;
  };

  // Paso 2: Enviar reserva y avanzar solo si es exitosa
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.date || !formData.startTime || formData.customers.length === 0) {
      setNotification({
        open: true,
        message: 'Por favor, completa todos los campos son obligatorios.',
        severity: 'error'
      });
      return;
    }
    const formattedData = {
      ...formData,
      startTime: `${formData.startTime}:00`,
      duration: parseInt(formData.duration, 10),
      groupSize: parseInt(formData.groupSize, 10),
    };
    try {
      const response = await reservationService.createWithPricing(formattedData);
      setReservationId(response.data.id_reservation);
      setActiveStep(2); // Avanza al paso 3 solo si fue exitosa
    } catch (error) {
      console.error('Error al enviar la información:', error);
      setNotification({
        open: true,
        message: 'Hubo un error al enviar la información',
        severity: 'error'
      });
    }
  };

  const generateTimeOptions = () => {
    if (!formData.date) return [];
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const startHour = isWeekend ? 10 : 14;
    const endHour = 22;
    let interval = 30;
    if (formData.duration === '35') interval = 35;
    if (formData.duration === '40') interval = 40;
    const options = [];
    for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
    return options;
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <div className="formContainer">
      <h1>Información Personal</h1>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <form className="customerForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          {/* Paso 1: Datos Reserva */}
          {activeStep === 0 && (
            <div>
              <h3>Datos Reserva</h3>
              <TextField
                label="Fecha reserva"
                name="date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleChange}
              />
              <TextField
                label="Duración reserva (vueltas)"
                name="duration"
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.duration}
                onChange={handleChange}
              >
                {tariffs.map((tariff) => (
                  <MenuItem key={tariff.id_tariff} value={tariff.maxMinutes}>
                    {tariff.maxMinutes} minutos
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Hora de llegada"
                name="startTime"
                select
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.startTime}
                onChange={handleChange}
              >
                {generateTimeOptions().map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Cantidad de personas"
                name="groupSize"
                type="number"
                inputProps={{ max: 15, min: 1 }}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.groupSize}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Paso 2: Datos Clientes */}
          {activeStep === 1 && (
            <>
              {formData.customers.map((customer, index) => (
                <div key={index} className="customerFields">
                  <h3>{index + 1}.- Cliente:</h3>
                  <TextField
                    label="Nombre"
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.name}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                  <TextField
                    label="Apellido"
                    name="lastname"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.lastname}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.email}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                  <TextField
                    label="Rut"
                    name="rut"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.rut}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                  <TextField
                    label="Teléfono"
                    name="phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.phone}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                  <TextField
                    label="Fecha de Nacimiento"
                    name="birthdate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    value={customer.birthdate}
                    onChange={(e) => handleCustomerChange(index, e)}
                  />
                </div>
              ))}
            </>
          )}

          {/* Paso 3: Confirmar y mostrar PaymentTable solo si hay reservationId */}
          {activeStep === 2 && reservationId && (
            <div style={{ width: '100%' }}>
              <PaymentTable reservationId={reservationId} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3, gap: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{
                    minWidth: 200,
                    backgroundColor: '#77B8B9',
                    color: '#F4F5F5',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#C98F51' }
                  }}
                >
                  Volver al Inicio
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirmation}
                  sx={{
                    minWidth: 200,
                    backgroundColor: '#77B8B9',
                    color: '#F4F5F5',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#C98F51' }
                  }}
                >
                  Confirmar Reserva
                </Button>
              </Box>
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Atrás
          </Button>
          {/* Paso 1: Siguiente */}
          {activeStep === 0 && (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                minWidth: 180,
                borderRadius: 100,
                backgroundColor: '#A3320A',
                color: '#E1D5D5',
                fontWeight: 600,
                fontSize: 20,
                fontFamily: "'Outfit', sans-serif",
                '&:hover': {
                  filter: "drop-shadow(0 0 20px #A3320A)",
                  color: '#303030',
                  textShadow: '0 0 12px #A3320A',
                },
              }}
              disabled={!isStepValid()}
            >
              Siguiente
            </Button>
          )}
          {/* Paso 2: Siguiente (envía reserva) */}
          {activeStep === 1 && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                minWidth: 180,
                borderRadius: 100,
                backgroundColor: '#A3320A',
                color: '#E1D5D5',
                fontWeight: 600,
                fontSize: 20,
                fontFamily: "'Outfit', sans-serif",
                '&:hover': {
                  filter: "drop-shadow(0 0 20px #A3320A)",
                  color: '#303030',
                  textShadow: '0 0 12px #A3320A',
                },
              }}
              disabled={!isStepValid()}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </form>
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomerFrom;
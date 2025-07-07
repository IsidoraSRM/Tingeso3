import React, { useState, useEffect } from 'react';
import { Button, TextField, Alert, Snackbar, Stepper, Step, StepLabel, Box, Typography, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom'; 
import tariffService from '../../services/tariff';
import reservationService from '../../services/reservation';
import './CustomerFrom.css';
import PaymentTable from '../PaymentTable/PaymentTable';

// Configurar dayjs para español
dayjs.locale('es');

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
  const [allReservations, setAllReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar tarifas
        const tariffsResponse = await tariffService.getAll();
        setTariffs(tariffsResponse.data);
        
        // Cargar todas las reservas
        const reservationsResponse = await reservationService.getAll();
        setAllReservations(reservationsResponse.data);
      } catch (error) {
        console.error('Error al obtener los datos iniciales:', error);
      }
    };
    fetchInitialData();
  }, []);
  const [loading, setLoading] = useState(false);

const handleConfirmation = async () => {
  if (!reservationId) {
    setNotification({
      open: true,
      message: 'No se encontró el ID de la reserva. Por favor intente nuevamente.',
      severity: 'error'
    });
    return;
  }
  
  setLoading(true);
  setNotification({
    open: true,
    message: '📧 Enviando confirmación por email...',
    severity: 'info'
  });
  
  try {
    await reservationService.sendConfirmationEmail(reservationId);
    setNotification({
      open: true,
      message: '🎉 ¡Reserva confirmada exitosamente! Revise su email para más detalles.',
      severity: 'success'
    });
    
    // Opcional: redirigir después de 3 segundos
    setTimeout(() => {
      navigate('/');
    }, 3000);
    
  } catch (confirmError) {
    console.error('Error al confirmar la reserva:', confirmError);
    
    let errorMessage = 'Error al confirmar la reserva.';
    if (confirmError.response?.data?.error) {
      errorMessage += ' ' + confirmError.response.data.error;
    } else if (confirmError.response?.status === 404) {
      errorMessage = 'No se encontró la reserva. Por favor verifique el ID.';
    } else if (confirmError.response?.status === 500) {
      errorMessage = 'Error del servidor. Por favor intente más tarde o contacte soporte.';
    }
    
    setNotification({
      open: true,
      message: errorMessage,
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
      // Limpiar la hora seleccionada para forzar nueva selección con disponibilidad actualizada
      setFormData({ ...formData, groupSize: newGroupSize, customers: updatedCustomers, startTime: '' });
    } else if (name === 'date' || name === 'duration') {
      // Limpiar la hora seleccionada cuando cambie la fecha o duración
      setFormData({ ...formData, [name]: value, startTime: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Funciones de validación simple
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRut = (rut) => {
    // Validación simple: formato básico con guión y dígito verificador
    const rutRegex = /^\d{7,8}-[\dkK]$/;
    return rutRegex.test(rut);
  };

  const validatePhone = (phone) => {
    // Validación para exactamente 9 números
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleCustomerChange = (index, e) => {
    const { name, value } = e.target;
    
    // Para el campo teléfono, filtrar solo números y limitar a 9 dígitos
    let processedValue = value;
    if (name === 'phone') {
      // Eliminar caracteres no numéricos y limitar a 9 dígitos
      processedValue = value.replace(/\D/g, '');
      // Limitar a 9 dígitos
      processedValue = processedValue.slice(0, 9);
    }
    
    const updatedCustomers = [...formData.customers];
    updatedCustomers[index][name] = processedValue;
    setFormData({ ...formData, customers: updatedCustomers });
    
    // Validar el campo si es email, RUT o teléfono
    if (name === 'email' || name === 'rut' || name === 'phone') {
      validateField(name, processedValue, index);
    }
  };

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'error' 
  });
  
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value, customerIndex = null) => {
    let error = '';
    
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        error = 'Formato de email inválido (ejemplo: usuario@dominio.com)';
      }
    }
    
    if (name === 'rut' && value) {
      if (!validateRut(value)) {
        error = 'Formato de RUT inválido (ejemplo: 12345678-9)';
      }
    }
    
    if (name === 'phone' && value) {
      if (!validatePhone(value)) {
        error = 'El teléfono debe tener exactamente 9 números (ejemplo: 912345678)';
      }
    }
    
    // Actualizar errores por campo
    const fieldKey = customerIndex !== null ? `${name}_${customerIndex}` : name;
    setFieldErrors(prev => ({
      ...prev,
      [fieldKey]: error
    }));
    
    return error === '';
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Validación simple por paso
  const isStepValid = () => {
    if (activeStep === 0) {
      return Boolean(formData.date && formData.duration && formData.startTime && formData.groupSize);
    }
    if (activeStep === 1) {
      return Boolean(formData.customers.every(
        c => c.name && c.lastname && c.rut && c.email && c.phone && c.birthdate
      ));
    }
    return Boolean(true);
  };

  // Validación detallada con mensajes específicos
  const getStepValidationMessage = () => {
    if (activeStep === 0) {
      const missing = [];
      if (!formData.date) missing.push('fecha');
      if (!formData.duration) missing.push('duración');
      if (!formData.startTime) missing.push('hora de inicio');
      if (!formData.groupSize) missing.push('tamaño del grupo');
      
      if (missing.length > 0) {
        return `Por favor complete: ${missing.join(', ')}`;
      }
    }
    if (activeStep === 1) {
      const incompleteCustomers = formData.customers.map((customer, index) => {
        const missing = [];
        if (!customer.name) missing.push('nombre');
        if (!customer.lastname) missing.push('apellido');
        if (!customer.rut) missing.push('RUT');
        if (!customer.email) missing.push('email');
        if (!customer.phone) missing.push('teléfono');
        if (!customer.birthdate) missing.push('fecha de nacimiento');
        
        return missing.length > 0 ? { index: index + 1, missing } : null;
      }).filter(Boolean);
      
      if (incompleteCustomers.length > 0) {
        const firstIncomplete = incompleteCustomers[0];
        return `Cliente ${firstIncomplete.index}: complete ${firstIncomplete.missing.join(', ')}`;
      }
    }
    return '';
  };

  // Paso 2: Enviar reserva y avanzar solo si es exitosa
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validación más detallada - Verificar que todos los campos estén completos
    if (!formData.date || !formData.startTime || formData.customers.length === 0) {
      const validationMessage = getStepValidationMessage();
      setNotification({
        open: true,
        message: validationMessage || 'Por favor, complete todos los campos obligatorios.',
        severity: 'warning'
      });
      return;
    }
    
    // Validación específica de clientes - verificar que todos los campos estén llenos
    const incompleteCustomers = formData.customers.map((customer, index) => {
      const missing = [];
      if (!customer.name?.trim()) missing.push('nombre');
      if (!customer.lastname?.trim()) missing.push('apellido');
      if (!customer.rut?.trim()) missing.push('RUT');
      if (!customer.email?.trim()) missing.push('email');
      if (!customer.phone?.trim()) missing.push('teléfono');
      if (!customer.birthdate?.trim()) missing.push('fecha de nacimiento');
      
      return missing.length > 0 ? { index: index + 1, missing } : null;
    }).filter(Boolean);
    
    if (incompleteCustomers.length > 0) {
      const firstIncomplete = incompleteCustomers[0];
      setNotification({
        open: true,
        message: `Cliente ${firstIncomplete.index}: Por favor complete los campos: ${firstIncomplete.missing.join(', ')}`,
        severity: 'warning'
      });
      return;
    }
    
    // Validación de fecha
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setNotification({
        open: true,
        message: 'No puede seleccionar una fecha anterior a hoy.',
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
      setNotification({
        open: true,
        message: '⏳ Procesando su reserva, por favor espere...',
        severity: 'info'
      });
      
      const response = await reservationService.createWithPricing(formattedData);
      setReservationId(response.data.idReservation);
      
      setNotification({
        open: true,
        message: '🎉 ¡Reserva creada exitosamente! Revise los detalles y confirme.',
        severity: 'success'
      });
      
      setActiveStep(2); // Avanza al paso 3 solo si fue exitosa
    } catch (error) {
      console.error('Error al enviar la información:', error);
      
      let errorMessage = 'Hubo un error al crear la reserva.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'La hora seleccionada no está disponible. Por favor seleccione otra hora.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Los datos ingresados no son válidos. Por favor revise la información.';
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Función para verificar si dos horarios se superponen
  const timeRangesOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  // Función para calcular el tiempo final basado en la duración
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Función para contar karts ocupados en un horario específico
  const getOccupiedKarts = (date, startTime, duration) => {
    if (!allReservations || !duration) return 0;
    
    const selectedDate = date;
    const proposedStartTime = startTime;
    const proposedEndTime = calculateEndTime(startTime, duration);
    
    let occupiedKarts = 0;
    
    allReservations.forEach(reservation => {
      // Solo considerar reservas del mismo día
      if (reservation.date === selectedDate) {
        const reservationStart = reservation.startTime.substring(0, 5); // Formato HH:MM
        const reservationEnd = reservation.endTime.substring(0, 5); // Formato HH:MM
        
        // Verificar si hay superposición de horarios
        if (timeRangesOverlap(proposedStartTime, proposedEndTime, reservationStart, reservationEnd)) {
          occupiedKarts += reservation.groupSize;
        }
      }
    });
    
    return occupiedKarts;
  };

  const generateTimeOptions = () => {
    if (!formData.date || !formData.duration) return [];
    
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const startHour = isWeekend ? 10 : 14;
    const endHour = 22;
    let interval = 30;
    if (formData.duration === '35') interval = 35;
    if (formData.duration === '40') interval = 40;
    
    const options = [];
    const maxKarts = 15;
    const dateString = formData.date;
    
    for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Verificar disponibilidad de karts
      const occupiedKarts = getOccupiedKarts(dateString, timeString, formData.duration);
      const availableKarts = maxKarts - occupiedKarts;
      
      // Solo agregar la opción si hay suficientes karts disponibles
      if (availableKarts >= formData.groupSize) {
        options.push({
          value: timeString,
          label: `${timeString} (${availableKarts} karts disponibles)`,
          available: availableKarts
        });
      }
    }
    
    return options;
  };

  const handleNext = () => {
    if (!isStepValid()) {
      setNotification({
        open: true,
        message: getStepValidationMessage() || 'Por favor complete todos los campos obligatorios.',
        severity: 'warning'
      });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="formContainer">
        <Box sx={{ 
          textAlign: 'center', 
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(163, 50, 10, 0.2)'
        }}><Typography 
            variant="h4" 
            sx={{ 
              color: '#303030', 
              mb: 2, 
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            Agendar Nueva Reserva
          </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#303030', 
            fontWeight: 400,
            fontFamily: "'Outfit', sans-serif",
            opacity: 0.8
          }}
        >
          Complete los siguientes pasos para agendar su reserva
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#303030', 
            fontWeight: 400,
            fontFamily: "'Outfit', sans-serif",
            opacity: 0.8
          }}
        >
          Paso {activeStep + 1} de {steps.length}: {steps[activeStep]}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%', mb: 3 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepIcon-root.Mui-active': {
              color: '#A3320A',
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: '#A3320A',
            },
            '& .MuiStepLabel-label.Mui-active': {
              color: '#A3320A',
              fontWeight: 600,
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: '#303030',
              fontWeight: 600,
            }
          }}
        >
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
              <Typography 
                variant="h5" 
                className="sectionTitle"
                sx={{
                  color: '#303030',
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  borderBottom: '3px solid #A3320A',
                  paddingBottom: 1,
                  marginBottom: 3,
                  display: 'inline-block'
                }}
              >
                📅 Datos de la Reserva
              </Typography>
              <DatePicker
                label="Fecha reserva"
                value={formData.date ? dayjs(formData.date) : null}
                onChange={(newValue) => {
                  const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                  handleChange({ target: { name: 'date', value: dateString } });
                }}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    variant: 'outlined',
                    helperText: '📅 Haga clic para abrir el calendario para seleccionar la fecha',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }
                  }
                }}
              />
              
              {/* Selector de duración con diseño de cuadrado */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#303030',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  🏁 Duración de la reserva
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: 'rgba(163, 50, 10, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(163, 50, 10, 0.2)'
                }}>
                  {tariffs.map((tariff) => (
                    <Box
                      key={tariff.id_tariff}
                      onClick={() => handleChange({ target: { name: 'duration', value: tariff.maxMinutes.toString() } })}
                      sx={{
                        minWidth: 80,
                        minHeight: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 2,
                        backgroundColor: formData.duration === tariff.maxMinutes.toString() ? '#A3320A' : 'white',
                        color: formData.duration === tariff.maxMinutes.toString() ? '#E1D5D5' : '#303030',
                        borderRadius: 1,
                        border: '2px solid #A3320A',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        // Mantener el efecto hover cuando está seleccionado
                        filter: formData.duration === tariff.maxMinutes.toString() ? "drop-shadow(0 0 8px #A3320A)" : "none",
                        '&:hover': {
                          backgroundColor: formData.duration === tariff.maxMinutes.toString() ? '#8B2C09' : 'rgba(163, 50, 10, 0.1)',
                          filter: "drop-shadow(0 0 8px #A3320A)",
                        }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          mb: 0.5
                        }}
                      >
                        {tariff.maxMinutes}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: "'Outfit', sans-serif",
                          opacity: 0.8,
                          fontSize: '11px'
                        }}
                      >
                        vueltas
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                {/* Información adicional */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      opacity: 0.6
                    }}
                  >
                    Seleccione la duración de su experiencia
                  </Typography>
                </Box>
              </Box>
              
              {/* Selector de cantidad de personas con botones */}
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#303030',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  👥 Cantidad de personas
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: 'rgba(163, 50, 10, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(163, 50, 10, 0.2)'
                }}>
                  <IconButton
                    onClick={() => {
                      if (formData.groupSize > 1) {
                        handleChange({ target: { name: 'groupSize', value: formData.groupSize - 1 } });
                      }
                    }}
                    disabled={formData.groupSize <= 1}
                    sx={{
                      backgroundColor: '#A3320A',
                      color: '#E1D5D5',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: '#8B2C09',
                        filter: "drop-shadow(0 0 8px #A3320A)",
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                        color: '#666'
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <Box sx={{ 
                    minWidth: 80, 
                    textAlign: 'center',
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    border: '2px solid #A3320A'
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700
                      }}
                    >
                      {formData.groupSize}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        opacity: 0.7
                      }}
                    >
                      {formData.groupSize === 1 ? 'persona' : 'personas'}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    onClick={() => {
                      if (formData.groupSize < 15) {
                        handleChange({ target: { name: 'groupSize', value: formData.groupSize + 1 } });
                      }
                    }}
                    disabled={formData.groupSize >= 15}
                    sx={{
                      backgroundColor: '#A3320A',
                      color: '#E1D5D5',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: '#8B2C09',
                        filter: "drop-shadow(0 0 8px #A3320A)",
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                        color: '#666'
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                
                {/* Información adicional */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      opacity: 0.6
                    }}
                  >
                    Mínimo: 1 persona
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      opacity: 0.6
                    }}
                  >
                    Máximo: 15 personas
                  </Typography>
                </Box>
              </Box>
              
              {/* Selector de hora con diseño de cuadrados */}
              {Boolean(formData.date && formData.duration && formData.groupSize) && (
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                      mb: 2
                    }}
                  >
                    🕐 Hora de llegada
                  </Typography>
                  
                  {generateTimeOptions().length > 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(163, 50, 10, 0.05)',
                      borderRadius: 2,
                      border: '1px solid rgba(163, 50, 10, 0.2)',
                      justifyContent: 'center'
                    }}>
                      {generateTimeOptions().map((timeOption) => (
                        <Box
                          key={timeOption.value}
                          onClick={() => handleChange({ target: { name: 'startTime', value: timeOption.value } })}
                          sx={{
                            minWidth: 100,
                            minHeight: 70,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            p: 1.5,
                            backgroundColor: formData.startTime === timeOption.value ? '#A3320A' : 'white',
                            color: formData.startTime === timeOption.value ? '#E1D5D5' : '#303030',
                            borderRadius: 1,
                            border: '2px solid #A3320A',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: formData.startTime === timeOption.value ? '#8B2C09' : 'rgba(163, 50, 10, 0.1)',
                              filter: "drop-shadow(0 0 8px #A3320A)",
                            }
                          }}
                        >
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              mb: 0.5
                            }}
                          >
                            {timeOption.value}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: "'Outfit', sans-serif",
                              opacity: 0.8,
                              fontSize: '10px'
                            }}
                          >
                            {timeOption.available} karts
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: 'rgba(163, 50, 10, 0.1)', 
                      borderRadius: 2,
                      border: '1px solid rgba(163, 50, 10, 0.3)',
                      textAlign: 'center'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#A3320A', 
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 600
                        }}
                      >
                        ⚠️ No hay horarios disponibles
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#303030', 
                          fontFamily: "'Outfit', sans-serif",
                          mt: 1
                        }}
                      >
                        Complete los campos anteriores para ver opciones
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Información adicional */}
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        opacity: 0.6
                      }}
                    >
                      Seleccione su horario preferido
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Mensaje informativo sobre disponibilidad */}
              {Boolean(formData.date && formData.duration && formData.groupSize && generateTimeOptions().length === 0) && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(163, 50, 10, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(163, 50, 10, 0.3)'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#A3320A', 
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    ⚠️ No hay horarios disponibles para {formData.groupSize} personas en esta fecha
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#303030', 
                      fontFamily: "'Outfit', sans-serif",
                      textAlign: 'center',
                      mt: 1
                    }}
                  >
                    Pruebe con una fecha diferente o reduzca el número de personas
                  </Typography>
                </Box>
              )}
              
              
              {/* Información sobre disponibilidad */}
              {Boolean(formData.date && formData.duration && formData.groupSize && generateTimeOptions().length > 0) && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(163, 50, 10, 0.05)', 
                  borderRadius: 2,
                  border: '1px solid rgba(163, 50, 10, 0.2)'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#303030', 
                      fontFamily: "'Outfit', sans-serif",
                      textAlign: 'center'
                    }}
                  >
                    ✅ {generateTimeOptions().length} horarios disponibles para {formData.groupSize} personas
                  </Typography>
                </Box>
              )}
            </div>
          )}

          {/* Paso 2: Datos Clientes */}
          {activeStep === 1 && (
            <>
              {formData.customers.map((customer, index) => (
                <div key={`customer-form-${index}-${formData.customers.length}`} className="customerFields">
                  <Typography 
                    variant="h6" 
                    sx={{
                      color: '#303030',
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                      borderBottom: '2px solid rgba(163, 50, 10, 0.3)',
                      paddingBottom: 1,
                      marginBottom: 2,
                      display: 'block'
                    }}
                  >
                    👤 Cliente {index + 1}
                  </Typography>
                  <TextField
                    label="Nombre"
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.name}
                    onChange={(e) => handleCustomerChange(index, e)}
                    helperText="Ej: María"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                  <TextField
                    label="Apellido"
                    name="lastname"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.lastname}
                    onChange={(e) => handleCustomerChange(index, e)}
                    helperText="Ej: Pérez"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.email}
                    onChange={(e) => handleCustomerChange(index, e)}
                    error={Boolean(fieldErrors[`email_${index}`])}
                    helperText={fieldErrors[`email_${index}`] || 'Ej: maria.perez@ejemplo.com'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                  <TextField
                    label="Rut"
                    name="rut"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.rut}
                    onChange={(e) => handleCustomerChange(index, e)}
                    error={Boolean(fieldErrors[`rut_${index}`])}
                    helperText={fieldErrors[`rut_${index}`] || 'Ej: 12345678-9'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                  <TextField
                    label="Teléfono"
                    name="phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.phone}
                    onChange={(e) => handleCustomerChange(index, e)}
                    error={Boolean(fieldErrors[`phone_${index}`])}
                    helperText={fieldErrors[`phone_${index}`] || 'Ej: 912345678 (9 dígitos)'}
                    slotProps={{
                      input: {
                        maxLength: 9,
                        pattern: '[0-9]*',
                        inputMode: 'numeric',
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A3320A',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A3320A',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#A3320A',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030',
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={customer.birthdate ? dayjs(customer.birthdate) : null}
                    onChange={(newValue) => {
                      const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                      handleCustomerChange(index, { target: { name: 'birthdate', value: dateString } });
                    }}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        variant: 'outlined',
                        helperText: '📅 Haga clic para abrir el calendario para seleccionar la fecha',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                              borderColor: '#A3320A',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#A3320A',
                              borderWidth: '2px ',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#A3320A !important',
                              borderWidth: '2px !important',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: "'Outfit', sans-serif",
                            color: '#A3320A',
                            fontWeight: 500,
                            '&.Mui-focused': {
                              color: '#A3320A',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            fontFamily: "'Outfit', sans-serif",
                            color: '#303030',
                            fontWeight: 500,
                          },
                          '& .MuiFormHelperText-root': {
                            fontFamily: "'Outfit', sans-serif",
                          },
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {/* Paso 3: Confirmar y mostrar PaymentTable solo si hay reservationId */}
          {activeStep === 2 && (
            <div style={{ width: '100%' }}>
              {reservationId ? (
                <>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    backgroundColor: 'rgba(244, 245, 245, 0.8)',
                    borderRadius: 2,
                    border: '2px solid #A3320A',
                    mb: 3
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#303030', 
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        mb: 2
                      }}
                    >
                      🎉 ¡Reserva Creada Exitosamente!
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        mb: 2
                      }}
                    >
                      Su reserva ha sido procesada correctamente
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        opacity: 0.8
                      }}
                    >
                      ID de Reserva: <strong>{reservationId}</strong>
                    </Typography>
                  </Box>
                  
                  <PaymentTable reservationId={reservationId} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4, 
                    p: 3,
                    backgroundColor: 'rgba(244, 245, 245, 0.8)',
                    borderRadius: 2,
                    border: '1px solid rgba(163, 50, 10, 0.2)'
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        mb: 3,
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      📧 Confirme su reserva
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{
                          minWidth: 180,
                          borderColor: '#A3320A',
                          color: '#A3320A',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#A3320A',
                            backgroundColor: 'rgba(163, 50, 10, 0.05)'
                          }
                        }}
                      >
                        🏠 Volver al Inicio
                      </Button>
                      
                      <Button
                        onClick={handleConfirmation}
                        variant="contained"
                        disabled={loading}
                        sx={{
                          minWidth: 220,
                          minHeight: 48,
                          borderRadius: 100,
                          backgroundColor: '#A3320A',
                          color: '#E1D5D5',
                          fontWeight: 'bold',
                          fontSize: 16,
                          fontFamily: "'Outfit', sans-serif",
                          '&:hover': { 
                            filter: "drop-shadow(0 0 20px #A3320A)",
                            textShadow: '0 0 12px #A3320A',
                          },
                          '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666'
                          }
                        }}
                      >
                        {loading ? '📧 Enviando confirmación...' : '✅ Confirmar Reserva'}
                      </Button>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#303030',
                        fontFamily: "'Outfit', sans-serif",
                        opacity: 0.7,
                        mt: 2,
                        textAlign: 'center'
                      }}
                    >
                      💡 Recibirá un email con todos los detalles de su reserva
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  backgroundColor: 'rgba(163, 50, 10, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(163, 50, 10, 0.2)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    ⏳ Procesando su reserva...
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#303030',
                      opacity: 0.7,
                      mt: 1,
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  >
                    ID de reserva: {reservationId || 'Generando...'}
                  </Typography>
                </Box>
              )}
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid rgba(163, 50, 10, 0.2)' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{
              minWidth: 120,
              borderColor: '#A3320A',
              color: '#A3320A',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              '&:hover': {
                borderColor: '#A3320A',
                backgroundColor: 'rgba(163, 50, 10, 0.05)'
              },
              '&:disabled': {
                opacity: 0.5
              }
            }}
          >
            ← Atrás
          </Button>
          
          {/* Información de progreso */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#303030', 
                opacity: 0.7,
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {activeStep + 1} de {steps.length}
            </Typography>
          </Box>
          
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
                fontSize: 16,
                fontFamily: "'Outfit', sans-serif",
                '&:hover': {
                  filter: "drop-shadow(0 0 20px #A3320A)",
                  backgroundColor: '#A3320A',
                  color: '#303030',
                  textShadow: '0 0 12px #A3320A',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666',
                  filter: 'none',
                  textShadow: 'none'
                }
              }}
            >
              Siguiente →
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
                fontSize: 16,
                fontFamily: "'Outfit', sans-serif",
                '&:hover': {
                  filter: "drop-shadow(0 0 20px #A3320A)",
                  backgroundColor: '#A3320A',
                  color: '#303030',
                  textShadow: '0 0 12px #A3320A',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666',
                  filter: 'none',
                  textShadow: 'none'
                }
              }}
            >
              Agendar Reserva →
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
    </LocalizationProvider>
  );
};

export default CustomerFrom;
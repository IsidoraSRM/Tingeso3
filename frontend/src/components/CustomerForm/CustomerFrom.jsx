import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import httpCommon from '../../http-common';
import tariffService from '../../services/tariff';
import reservationService from '../../services/reservation';
import './CustomerFrom.css';


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

  const [tariffs, setTariffs] = useState([]); // Estado para almacenar las tarifas
  const navigate = useNavigate(); // Hook para redirigir a otra página

  // Función para obtener las tarifas desde el service
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log("Reserva creada:", response.data);
  
      
      navigate('/payment', { 
        state: { reservationId: response.data.id_reservation } 
      });
    } catch (error) {
      console.error('Error al enviar la información:', error);
      alert('Hubo un error al enviar la información');
    }
  };
  const generateTimeOptions = () => {
    // Si no hay fecha seleccionada, devuelve un array vacío
  if (!formData.date) return [];
  
  const selectedDate = new Date(formData.date);
  const dayOfWeek = selectedDate.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado
  
  // Determina si es fin de semana (0: domingo, 6: sábado)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Hora de inicio según el día (10:00 para fines de semana, 14:00 para días laborales)
  const startHour = isWeekend ? 10 : 14;
  const endHour = 22; // Hora de cierre para todos los días
  
  // Obtener el intervalo según la duración seleccionada
  let interval = 30; // Valor predeterminado
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

  return (
    <div className="formContainer">
      <h1>Información Personal</h1>
      <form className="customerForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          {/* Primera columna: Información de la reserva */}
          <div>
            <h3>Datos Reserva</h3>
            <TextField
              label="Fecha reserva"
              name="date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.date}
              onChange={handleChange}
            />
            <TextField
              label="Duración reserva (vueltas)"
              name="duration"
              select // Convierte el TextField en un menú desplegable
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

          {/* Columnas dinámicas: Formularios de clientes */}
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
                InputLabelProps={{
                  shrink: true,
                }}
                value={customer.birthdate}
                onChange={(e) => handleCustomerChange(index, e)}
              />
            </div>
          ))}
        </div>
        <Button
              variant="contained"
              onClick={() => window.location.href = '/reservation'}
              sx={{ 
                minWidth: 306,
                minHeight: 98,
                borderRadius: 100,
                backgroundColor: '#A3320A',
                color: '#E1D5D5',
                fontWeight: 600,
                fontSize: 32,
                letterSpacing: 1.6 ,
                fontFamily: "'Outfit', sans-serif",
                '&:hover': {
                  filter: "drop-shadow(0 0 20px #A3320A)",
                  color: '#303030',
                  textShadow: '0 0 12px #A3320A',
                },
                '&:active': {
                  backgroundColor: '#C98F51',
                  opacity: 1
                }
              }}  
            >
          Enviar
        </Button>
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
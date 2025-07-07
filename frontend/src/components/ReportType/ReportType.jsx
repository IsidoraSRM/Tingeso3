import React, { useState } from 'react';
import { 
  Paper, Typography, Grid, TextField, 
  FormControl, RadioGroup, FormControlLabel, Radio,
  Button, Alert, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportType = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reportType: 'laps' 
  });
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar fechas
    if (!formData.startDate || !formData.endDate) {
      setNotification({
        open: true,
        message: '📅 Por favor, selecciona ambas fechas para generar el reporte',
        severity: 'warning'
      });
      return;
    }
    
    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setNotification({
        open: true,
        message: '⚠️ La fecha inicial no puede ser posterior a la fecha final',
        severity: 'error'
      });
      return;
    }
    
    setNotification({
      open: true,
      message: '📊 Generando reporte, por favor espere...',
      severity: 'info'
    });
    
    // Redireccionar según el tipo de reporte seleccionado
    if (formData.reportType === 'laps') {
      navigate('/laps-report', { 
        state: { 
          startDate: formData.startDate, 
          endDate: formData.endDate 
        } 
      });
    } else if (formData.reportType === 'groups') {
      navigate('/group-report', { 
        state: { 
          startDate: formData.startDate, 
          endDate: formData.endDate 
        } 
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ 
      marginTop: 4, 
      p: 4, 
      maxWidth: 600, 
      mx: 'auto',
      borderRadius: 2,
      border: '2px solid #A3320A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 20px rgba(163, 50, 10, 0.3)',
      backgroundColor: 'rgba(244, 245, 245, 0.8)',
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#303030', 
          mb: 1,
          textAlign: 'center',
          fontWeight: 700,
          fontFamily: "'Outfit', sans-serif"
        }}
      >
        📊 Generar Reporte de Ingresos
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#303030',
          opacity: 0.8,
          textAlign: 'center',
          mb: 3,
          fontFamily: "'Outfit', sans-serif"
        }}
      >
        Seleccione el período y tipo de reporte que desea generar
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          {/* Fecha de inicio */}
          <Grid size={12}>
            <TextField
              label="Fecha inicial"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{ 
                inputLabel: { shrink: true },
                input: {
                  sx: {
                    fontFamily: "'Outfit', sans-serif"
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#A3320A',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#A3320A',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Outfit', sans-serif",
                  '&.Mui-focused': {
                    color: '#A3320A',
                  },
                },
              }}
            />
          </Grid>
          
          {/* Fecha de fin */}
          <Grid size={12}>
            <TextField
              label="Fecha final"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{ 
                inputLabel: { shrink: true },
                input: {
                  sx: {
                    fontFamily: "'Outfit', sans-serif"
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#A3320A',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#A3320A',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontFamily: "'Outfit', sans-serif",
                  '&.Mui-focused': {
                    color: '#A3320A',
                  },
                },
              }}
            />
          </Grid>
          
          {/* Tipo de reporte */}
          <Grid size={12}>
            <FormControl component="fieldset" required sx={{ width: '100%' }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: '#303030',
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  mb: 2
                }}
              >
                📋 Tipo de Reporte
              </Typography>
              <RadioGroup
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    color: '#303030'
                  }
                }}
              >
                <FormControlLabel 
                  value="laps" 
                  control={
                    <Radio 
                      sx={{ 
                        color: '#A3320A', 
                        '&.Mui-checked': { 
                          color: '#A3320A' 
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(163, 50, 10, 0.04)'
                        }
                      }} 
                    />
                  } 
                  label="🏁 Reporte por Vueltas/Tiempo" 
                />
                <FormControlLabel 
                  value="groups" 
                  control={
                    <Radio 
                      sx={{ 
                        color: '#A3320A', 
                        '&.Mui-checked': { 
                          color: '#A3320A' 
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(163, 50, 10, 0.04)'
                        }
                      }} 
                    />
                  } 
                  label="👥 Reporte por Tamaño de Grupo" 
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Botón enviar */}
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: 220,
                minHeight: 48,
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
                '&:active': {
                  backgroundColor: '#A3320A',
                  opacity: 1
                }
              }}
            >
              📊 Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </form>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ReportType;
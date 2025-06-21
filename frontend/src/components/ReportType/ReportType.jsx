import React, { useState } from 'react';
import { 
  Paper, Typography, Box, Grid, TextField, 
  FormControl, RadioGroup, FormControlLabel, Radio,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportType = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reportType: 'laps' 
  });

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
      alert('Por favor, selecciona ambas fechas');
      return;
    }
    
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
    <Paper elevation={3} sx={{ marginTop: 4, p: 4, maxWidth: 500, mx: 'auto', bgcolor: '#fff' }}>
      <h1 sx={{ color: '#77B8B9', mb: 3, textAlign: 'center' }}>
        Generar Reporte de Ingresos
      </h1>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          {/* Fecha de inicio */}
          <Grid gridsize={12}>
            <TextField
              label="Fecha inicial"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {/* Fecha de fin */}
          <Grid gridsize={12}>
            <TextField
              label="Fecha final"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {/* Tipo de reporte */}
          <Grid gridsize={12}>
            <FormControl component="fieldset" required sx={{ width: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Modelos de Reporte
              </Typography>
              <RadioGroup
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
              >
                <FormControlLabel 
                  value="laps" 
                  control={<Radio sx={{ color: '#77B8B9', '&.Mui-checked': { color: '#C98F51' } }} />} 
                  label="Reporte por Vueltas/Tiempo" 
                />
                <FormControlLabel 
                  value="groups" 
                  control={<Radio sx={{ color: '#77B8B9', '&.Mui-checked': { color: '#C98F51' } }} />} 
                  label="Reporte por Tamaño de Grupo" 
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Botón enviar */}
          <Grid gridsize={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#77B8B9',
                color: '#F4F5F5',
                fontWeight: 'bold',
                
                minWidth: 200,
                '&:hover': {
                    backgroundColor:  '#C98F51',
                  },
                  '&:active': {
                    backgroundColor:  '#C98F51',
                    opacity: 1
                  }
              }}
            >
              Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ReportType;
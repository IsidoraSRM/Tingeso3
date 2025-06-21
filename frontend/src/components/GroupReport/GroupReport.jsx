import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservation';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Button, Grid
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GroupReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startDate, endDate } = location.state || { startDate: '', endDate: '' };
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.getLapsTimeReport(startDate, endDate);
      setReportData(response.data);
    } catch (err) {
      console.error('Error al obtener el reporte:', err);
      setError('Ocurrió un error al cargar los datos del reporte. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const handleBack = () => {
    navigate('/reports');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Button 
          
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ 
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
          }}
          
        >
          Volver
        </Button>
        <Typography variant="h5" sx={{ color: '#77B8B9', fontWeight: 'bold' }}>
          Reporte de Ingresos por Tamaño de Grupo
        </Typography>
        <Box /> {/* Spacer para equilibrar el layout */}
      </Box>

      <Box sx={{ mb: 3, bgcolor: '#f7f7f7', p: 2, borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid gridsize={{ xs: 12, md: 6 }}>
            <Typography variant="body1">
              <strong>Fecha de inicio:</strong> {new Date(startDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid gridsize={{ xs: 12, md: 6 }}>
            <Typography variant="body1">
              <strong>Fecha de fin:</strong> {new Date(endDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress sx={{ color: '#77B8B9' }} />
          <Typography sx={{ ml: 2 }}>Cargando datos del reporte...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, bgcolor: '#ffebee', borderRadius: 1, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 2 }} 
            onClick={fetchReport}
          >
            Reintentar
          </Button>
        </Box>
      ) : reportData ? (
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Rango de Personas</TableCell>
                {reportData.months.map((month, index) => (
                  <TableCell key={index} align="right" sx={{ fontWeight: 'bold' }}>
                    {month}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Filas de categorías por tamaño de grupo */}
              {reportData.data.map((category, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  {category.values.map((value, i) => (
                    <TableCell key={i} align="right">
                      {formatCurrency(value)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }}>
                    {formatCurrency(category.total)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Fila de totales */}
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Total Mensual
                </TableCell>
                {reportData.totalsByMonth.map((total, index) => (
                  <TableCell key={index} align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(total)}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: '#f5f5f5'
                }}>
                  {formatCurrency(reportData.grandTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box display="flex" justifyContent="center" p={5} sx={{ bgcolor: '#f8f8f8', borderRadius: 1 }}>
          <Typography variant="body1" color="text.secondary">
            No hay datos disponibles para el rango de fechas seleccionado
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GroupReport;
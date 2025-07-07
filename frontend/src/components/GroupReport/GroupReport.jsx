import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.getGroupSizeReport(startDate, endDate);
      
      // Validar que la respuesta tenga la estructura esperada
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Respuesta del servidor inválida');
      }
      
      // Validar que existan los campos requeridos
      const { data, months } = response.data;
      if (!data || !Array.isArray(data) || !months || !Array.isArray(months)) {
        throw new Error('Estructura de datos inválida del servidor');
      }
      
      setReportData(response.data);
    } catch (err) {
      console.error('Error al obtener el reporte:', err);
      
      // Mensaje de error más específico según el tipo de error
      let errorMessage = 'Ocurrió un error al cargar los datos del reporte.';
      
      if (err.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Es posible que no haya datos para el rango de fechas seleccionado.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Parámetros de fecha inválidos.';
      } else if (err.message.includes('inválida')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate, fetchReport]);

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const handleBack = () => {
    navigate('/reports');
  };

  return (
    <Paper elevation={3} sx={{ 
      p: 4, 
      mb: 4, 
      mt: 4,
      borderRadius: 2,
      border: '2px solid #A3320A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 20px rgba(163, 50, 10, 0.3)',
      backgroundColor: 'rgba(244, 245, 245, 0.8)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ 
            backgroundColor: '#A3320A',
            color: '#E1D5D5', 
            fontWeight: 600,
            fontFamily: "'Outfit', sans-serif",
            borderRadius: 100,
            minWidth: 120,
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
          Volver
        </Button>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#303030', 
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            textAlign: 'center'
          }}
        >
          👥 Reporte de Ingresos por Tamaño de Grupo
        </Typography>
        <Box /> {/* Spacer para equilibrar el layout */}
      </Box>

      <Box sx={{ 
        mb: 3, 
        backgroundColor: 'rgba(163, 50, 10, 0.1)', 
        p: 3, 
        borderRadius: 2,
        border: '1px solid rgba(163, 50, 10, 0.2)'
      }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="body1"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                color: '#303030',
                fontWeight: 500
              }}
            >
              📅 <strong>Fecha de inicio:</strong> {new Date(startDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              variant="body1"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                color: '#303030',
                fontWeight: 500
              }}
            >
              📅 <strong>Fecha de fin:</strong> {new Date(endDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress sx={{ color: '#A3320A' }} />
          <Typography 
            sx={{ 
              ml: 2,
              fontFamily: "'Outfit', sans-serif",
              color: '#303030'
            }}
          >
            ⏳ Cargando datos del reporte...
          </Typography>
        </Box>
      )}
      
      {!loading && error && (
        <Box sx={{ 
          p: 3, 
          backgroundColor: 'rgba(163, 50, 10, 0.1)', 
          borderRadius: 2, 
          textAlign: 'center',
          border: '1px solid rgba(163, 50, 10, 0.3)'
        }}>
          <Typography 
            sx={{
              color: '#A3320A',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600
            }}
          >
            ⚠️ {error}
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 2,
              backgroundColor: '#A3320A',
              color: '#E1D5D5',
              fontFamily: "'Outfit', sans-serif",
              '&:hover': {
                backgroundColor: '#8B2C09'
              }
            }} 
            onClick={fetchReport}
          >
            🔄 Reintentar
          </Button>
        </Box>
      )}
      
      {!loading && !error && reportData && (
        <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(163, 50, 10, 0.1)' }}>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  width: '20%',
                  color: '#303030',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 16
                }}>
                  👥 Rango de Personas
                </TableCell>
                {reportData.months.map((month) => (
                  <TableCell 
                    key={`month-${month}`} 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16
                    }}
                  >
                    {month}
                  </TableCell>
                ))}
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'rgba(163, 50, 10, 0.2)',
                    color: '#303030',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16
                  }}
                >
                  💰 Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Filas de categorías por tamaño de grupo */}
              {reportData.data.map((category) => (
                <TableRow 
                  key={`category-${category.name}`} 
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: 'rgba(163, 50, 10, 0.02)' 
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(163, 50, 10, 0.05)'
                    }
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{
                      fontFamily: "'Outfit', sans-serif",
                      color: '#303030',
                      fontWeight: 500
                    }}
                  >
                    {category.name}
                  </TableCell>
                  {category.values.map((value, i) => (
                    <TableCell 
                      key={`value-${category.name}-${i}`} 
                      align="center"
                      sx={{
                        fontFamily: "'Outfit', sans-serif",
                        color: '#303030'
                      }}
                    >
                      {formatCurrency(value)}
                    </TableCell>
                  ))}
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontFamily: "'Outfit', sans-serif",
                      color: '#303030',
                      fontWeight: 600
                    }}
                  >
                    {formatCurrency(category.total)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Fila de totales */}
              <TableRow sx={{ backgroundColor: 'rgba(163, 50, 10, 0.1)' }}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#303030',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 16
                  }}
                >
                  💰 TOTAL MENSUAL
                </TableCell>
                {reportData.totalsByMonth.map((total, index) => (
                  <TableCell 
                    key={`total-month-${reportData.months[index] || index}`} 
                    align="center" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#303030',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16
                    }}
                  >
                    {formatCurrency(total)}
                  </TableCell>
                ))}
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: 'rgba(163, 50, 10, 0.2)',
                    color: '#A3320A',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18
                  }}
                >
                  {formatCurrency(reportData.grandTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {!loading && !error && !reportData && (
        <Box 
          display="flex" 
          justifyContent="center" 
          p={5} 
          sx={{ 
            backgroundColor: 'rgba(163, 50, 10, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(163, 50, 10, 0.2)'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{
              color: '#303030',
              fontFamily: "'Outfit', sans-serif",
              opacity: 0.8
            }}
          >
            📄 No hay datos disponibles para el rango de fechas seleccionado
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GroupReport;
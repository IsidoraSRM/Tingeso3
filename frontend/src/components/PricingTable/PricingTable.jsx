import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import tariffService from '../../services/tariff';


export default function PricingTable() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar los datos de tarifas cuando el componente se monte
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const response = await tariffService.getAll();
      setTariffs(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tariffs:", err);
      setError("No se pudieron cargar las tarifas. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress sx={{ color: '#A3320A' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ 
        marginTop: 3, 
        p: 4, 
        textAlign: 'center',
        backgroundColor: 'rgba(244, 245, 245, 0.8)',
        border: '1px solid rgba(163, 50, 10, 0.2)',
        borderRadius: 2
      }}>
        <Typography 
          variant="h6"
          sx={{ 
            color: '#A3320A',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600
          }}
        >
          {error}
        </Typography>
      </Paper>
    );
  }
  return (
    <Paper elevation={3} sx={{ 
      margin: 'auto', 
      marginTop: 5, 
      maxWidth: 1200,
      borderRadius: 2,
      border: '2px solid #A3320A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 20px rgba(163, 50, 10, 0.3)'
    }}>
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#f4f5f5a2',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottom: '1px solid rgba(163, 50, 10, 0.2)'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: '#303030',
            fontFamily: "'Outfit', sans-serif",
            textAlign: 'center'
          }}
        >
          💰 Precios del Karting
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#303030',
            opacity: 0.8,
            textAlign: 'center',
            mt: 1,
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          Precios y duración de las experiencias disponibles
        </Typography>
      </Box>
      
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de tarifas de karting">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(163, 50, 10, 0.1)' }}>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  color: '#303030',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Número de vueltas
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  color: '#303030',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Precios Base
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: 16,
                  color: '#303030',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Duración total de la reserva
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tariffs.map((tariff, index) => (
              <TableRow
                key={tariff.laps || index}
                sx={{ 
                  '&:nth-of-type(odd)': { 
                    backgroundColor: 'rgba(163, 50, 10, 0.02)' 
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(163, 50, 10, 0.05)'
                  },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row" 
                  align="center"
                  sx={{ 
                    fontSize: '16px',
                    fontFamily: "'Outfit', sans-serif",
                    color: '#303030'
                  }}
                >
                  {tariff.laps} vueltas
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontSize: '16px',
                    fontFamily: "'Outfit', sans-serif",
                    color: '#303030',
                    fontWeight: 600
                  }}
                >
                  ${tariff.price?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontSize: '16px',
                    fontFamily: "'Outfit', sans-serif",
                    color: '#303030'
                  }}
                >
                  {tariff.totalDuration} min
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
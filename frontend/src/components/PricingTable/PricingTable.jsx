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
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    
    <TableContainer component={Paper} sx={{ margin: 'auto', marginTop: 5, maxWidth: 1700 }}  >
      <Table sx={{ minWidth: 650 }} aria-label="simple table"  >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '18px' }} >Número de vueltas o tiempo
            máximo permitido</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Precios Regulares</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Duración total de la
            reserva </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {tariffs.map((tariff) => (
            <TableRow
              key={tariff.laps}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontSize: '16px' }} >
                {tariff.laps} vueltas o máx {tariff.max_minutes} min
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '16px' }}>$ {tariff.price}</TableCell>
              <TableCell align="center" sx={{ fontSize: '16px' }}>{tariff.total_duration} min</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
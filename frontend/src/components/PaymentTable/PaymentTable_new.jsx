import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Typography 
} from '@mui/material';
import reservationService from '../../services/reservation';

function ccyFormat(num) {
  return `$${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

const PaymentTable = ({ reservationId }) => {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await reservationService.getReservationWithPricing(reservationId);
        setReservation(response.data);
      } catch (error) {
        console.error('Error al obtener la reserva:', error);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (!reservation) {
    return (
      <Paper sx={{ 
        marginTop: 3, 
        p: 4, 
        textAlign: 'center',
        backgroundColor: 'rgba(163, 50, 10, 0.05)',
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
          Cargando detalles de la reserva...
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
          Por favor espere mientras procesamos su información
        </Typography>
      </Paper>
    );
  }

  const { date, startTime, customers, individualPrices, individualDscs = [], totalAmount } = reservation;

  return (
    <Paper elevation={3} sx={{ 
      marginTop: 3, 
      borderRadius: 2,
      border: '2px solid #A3320A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 20px rgba(163, 50, 10, 0.3)'
    }}>
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'rgba(163, 50, 10, 0.05)',
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
          📋 Resumen de su Reserva
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
          Fecha: {date} • Hora: {startTime} • Participantes: {customers?.length || 0}
        </Typography>
      </Box>
      
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="tabla de detalles de reserva">
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
                Cliente
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
                RUT
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
                Precio Base
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
                Descuento
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
                Precio Final
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer, index) => (
              <TableRow 
                key={customer.id || index}
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
                  align="center"
                  sx={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {customer.name} {customer.lastname}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {customer.rut}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {ccyFormat(individualPrices?.[index] || 0)}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    fontFamily: "'Outfit', sans-serif",
                    color: individualDscs?.[index] > 0 ? '#77B8B9' : 'inherit',
                    fontWeight: individualDscs?.[index] > 0 ? 600 : 400
                  }}
                >
                  {individualDscs?.[index] > 0 ? `${individualDscs[index]}%` : 'Sin descuento'}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    color: '#303030'
                  }}
                >
                  {ccyFormat((individualPrices?.[index] || 0) * (1 - (individualDscs?.[index] || 0) / 100))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: 'rgba(163, 50, 10, 0.1)' }}>
              <TableCell 
                colSpan={4} 
                align="right"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: 18,
                  color: '#303030',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                TOTAL A PAGAR:
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: 20,
                  color: '#A3320A',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                {ccyFormat(totalAmount || 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

PaymentTable.propTypes = {
  reservationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default PaymentTable;

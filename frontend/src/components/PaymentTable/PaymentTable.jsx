import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import reservationService from '../../services/reservation';




function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const PaymentTable = ({ reservationId }) => {
  const [reservation, setReservation] = useState(null); // Estado para almacenar la reserva

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        // Llama al endpoint para obtener la reserva con los precios calculados
        const response = await reservationService.getReservationWithPricing(reservationId);
      setReservation(response.data); // Guarda la reserva en el estado
      } catch (error) {
        console.error('Error al obtener la reserva:', error);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (!reservation) {
    return <p>Cargando datos de la reserva...</p>;
  }

  const { date, startTime, customers, individualPrices,individualDscs = [], totalAmount } = reservation;

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow >
            <TableCell align="center" colSpan={5} sx={{ fontWeight: 'bold', fontSize: 18 }} >
              Detalles de la Reserva
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: 14 }}>Fecha Reserva</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: 14 }}>Hora Reserva</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: 14 }}>Nombre Cliente</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: 14 }}>Correo </TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 14 }}>Descuento</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: 14 }}>Precio Individual</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={`${customer.email}-${customer.rut}`}>
              <TableCell>{date}</TableCell>
              <TableCell>{startTime}</TableCell>
              <TableCell>{`${customer.name} ${customer.lastname}`}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell align="right">- {ccyFormat(individualDscs[customers.indexOf(customer)])} %</TableCell>
              <TableCell align="right">$ {ccyFormat(individualPrices[customers.indexOf(customer)])}</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          ))}
          <TableRow >
            
            <TableCell  colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: 14 }}>Total sin IVA</TableCell>
            <TableCell align="right">  </TableCell>
            <TableCell align="right">$ {ccyFormat(totalAmount)-((ccyFormat(totalAmount)*19)/100.00)}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
          <TableRow >
            
            <TableCell  colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: 14 }}>IVA</TableCell>
            <TableCell align="right"> + 19% </TableCell>
            <TableCell align="right">$ {(ccyFormat(totalAmount)*19)/100.00}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
          <TableRow>
            
            <TableCell  colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: 16 }}>Total</TableCell>
            <TableCell colSpan={5} align="center">$ {ccyFormat(totalAmount)}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Validación de props
PaymentTable.propTypes = {
  reservationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PaymentTable;

import { Container, Box } from '@mui/material';
import CustomerFrom from '../../components/CustomerForm/CustomerFrom';

const Reservation = () => {
  return (
    <Container maxWidth={false} sx={{ width: 1440, mx: 'auto', px: 0, py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        
      </Box>
      <CustomerFrom />
    </Container>
  );
};

export default Reservation;

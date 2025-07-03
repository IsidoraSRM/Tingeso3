

import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Button } from '@mui/material';
import Pista from '../../components/Pista/Pista'; // Asegúrate de que la ruta sea correcta

const Home = () => {

useEffect(() => {
  // Código de animación para el futuro si es necesario
}, []);



  return (
    <Container maxWidth={false} sx={{ width: 1440, mx: 'auto', px: 0 }}>
      <Grid container spacing={2} columns={12} sx={{ mt: 5, mb: 4, ml: '132px', mr: '0px' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 4,
              backgroundColor: 'rgba(255,255,255,0)',
              borderRadius: 2,
              width: 529.65
            }}
          >
            {/* Contenido de bienvenida */}
            <Typography variant="h3" sx={{ color: '#303030', mb: 2, fontWeight: 800 }}>
              ¡Bienvenido a 
              KartingRM!
            </Typography>
            <Typography variant="h4" sx={{ color: '#303030', fontWeight: 600, mb: 3 }}>
              El Mejor Karting de la Región Metropolitana
            </Typography>
            <Typography variant="h6" sx={{ color: '#303030',fontWeight: 500, mb: 2 }}>
              Vive la experiencia única de velocidad y adrenalina
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {/* Boton Reserva */}
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
              ¡RESERVA YA!
            </Button>
          </Box>
        </Grid>
       
        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: -6, mb: 0, ml: -6, mr: 0 }}>
                {/* secuencia de imágenes */}
                <Pista/>
        </Grid>
        <Grid size={12} sx={{ mt: 0, mb: 0, ml: 4, mr: 6 }}>
          <Box
            sx={{
              width: 1065,
              height: 75,
              background: 'rgba(61, 61, 78, 0.60)',
              borderRadius: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: 16,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: 4,
                wordWrap: 'break-word',
                textAlign: 'center',
              }}
            >
              Pistas de nivel internacional • Equipamiento de primera • Diversión garantizada
            </Typography>
          </Box>
        </Grid>

              

      </Grid>
      

    </Container>
  );
};

export default Home;
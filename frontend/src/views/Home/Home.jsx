

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Container,Button } from '@mui/material';
import Pista from '../../components/Pista/Pista'; // Asegúrate de que la ruta sea correcta
const frameCount = 10;
const animationFrames = Array.from({ length: frameCount }, (_, i) => `/animation/Imagen${i + 1}.png`);

const Home = () => {

const [currentFrame, setCurrentFrame] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentFrame((prevFrame) => (prevFrame + 1) % animationFrames.length);
  }, 100); // cambia la velocidad aquí (ms por frame)

  return () => clearInterval(interval);
}, []);



  return (
    <Container maxWidth={false} sx={{ width: 1440, mx: 'auto', px: 0 }}>
      <Grid container spacing={2} columns={12} sx={{ mt: 5, mb: 4, ml: '132px', mr: '0px' }}>
        <Grid item xs={12} md={6}>
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
       
        <Grid item xs={12} md={6} sx={{ mt: -6, mb: 0, ml: -6, mr: 0 }}>
                {/* secuencia de imágenes */}
                <Pista/>
        </Grid>
        <Grid item xs={12} sx={{ mt: 0, mb: 0, ml: 4, mr: 6 }}>
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



// import React from 'react';
// import { Box, Typography, Paper, Grid } from '@mui/material';
// import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import PeopleIcon from '@mui/icons-material/People';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import PaymentIcon from '@mui/icons-material/Payment';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// /*
// #F4F5F5 blanco
// #77B8B9 celeste
// #CA5833 rojo
// #C98F51 naranja
// #3A3A4B gris oscuro
// */

// const Home = () => {
//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6}>
//         <Box
//           sx={{
//             p: 4,
//             backgroundColor: 'rgba(255,255,255,0.5)',
//             borderRadius: 2,
//             width: '100%',
//           }}
//         >
//           {/* Bienvenida */}
//           <Box sx={{
//             backgroundColor: 'rgba(255,255,255,0.5)',
//             marginLeft: 0,
//             marginRight: 'auto',
//             width: 'fit-content'
//           }}>
//             <Typography variant="h3" sx={{
//               color: '#3A3A4B',
//               mb: 2,
//               fontWeight: 'bold'
//             }}>
//               ¡Bienvenido a KartingRM!
//             </Typography>

//             <Typography variant="h4" sx={{
//               color: '#77B8B9',
//               fontWeight: 'bold',
//               mb: 3
//             }}>
//               El Mejor Karting de la Región Metropolitana
//             </Typography>

//             <Typography variant="h6" sx={{
//               color: '#666',
//               mb: 2
//             }}>
//               Vive la experiencia única de velocidad y adrenalina
//             </Typography>
//           </Box>
//         </Box>
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//           <EmojiEventsIcon sx={{ color: '#C98F51', fontSize: 40, mr: 1 }} />
//           <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
//             Pistas de nivel internacional • Equipamiento de primera • Diversión garantizada
//           </Typography>
//           <EmojiEventsIcon sx={{ color: '#C98F51', fontSize: 40, ml: 1 }} />
//         </Box>

//         <Grid container spacing={4} justifyContent="center">
//           {/* Tarjeta 1 */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={3} sx={{
//               p: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               height: '200px'
//             }}>
//               <DirectionsCarIcon sx={{ fontSize: 60, color: '#77B8B9', mb: 2 }} />
//               <Typography variant="h6">Opciones y precios</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Verifica las tarifas del karting
//               </Typography>
//             </Paper>
//           </Grid>

//           {/* Tarjeta 2 */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={3} sx={{
//               p: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               height: '200px'
//             }}>
//               <CalendarTodayIcon sx={{ fontSize: 60, color: '#77B8B9', mb: 2 }} />
//               <Typography variant="h6">Reservaciones</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Gestiona horarios y reservas
//               </Typography>
//             </Paper>
//           </Grid>

//           {/* Tarjeta 3 */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={3} sx={{
//               p: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               height: '200px'
//             }}>
//               <PaymentIcon sx={{ fontSize: 60, color: '#77B8B9', mb: 2 }} />
//               <Typography variant="h6">Pagos</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Gestiona cobros y facturación
//               </Typography>
//             </Paper>
//           </Grid>

//           {/* Tarjeta 4 */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={3} sx={{
//               p: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               height: '200px'
//             }}>
//               <BarChartIcon sx={{ fontSize: 60, color: '#77B8B9', mb: 2 }} />
//               <Typography variant="h6">Reportes</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Estadísticas e informes de ingresos
//               </Typography>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   )
// }

// export default Home;
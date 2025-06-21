import React from 'react';
import { Box, Typography, Paper, Grid, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Contact = () => {
  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: '800px',
      mx: 'auto', 
      mt: 4 
    }}>
      <Typography variant="h3" sx={{ 
        color: '#3A3A4B', 
        fontWeight: 'bold',
        textAlign: 'center',
        mb: 4
      }}>
        Contacto
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ 
          color: '#77B8B9', 
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center'
        }}>
          Información de Contacto
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOnIcon sx={{ color: '#C98F51', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6">Dirección</Typography>
                <Typography variant="body1">
                  Av. Undostres Norte 1234, Santiago, Región Metropolitana
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <PhoneIcon sx={{ color: '#C98F51', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6">Teléfono</Typography>
                <Typography variant="body1">
                  <Link href="tel:+56912345678" underline="hover" color="inherit">
                    +56 9 1234 5678
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <EmailIcon sx={{ color: '#C98F51', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6">Email</Typography>
                <Typography variant="body1">
                  <Link href="mailto:kartingrmbusiness@gmail.com" underline="hover" color="inherit">
                    kartingrmbusiness@gmail.com
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <AccessTimeIcon sx={{ color: '#C98F51', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6">Horarios</Typography>
                <Typography variant="body1">
                  Lunes a Viernes: 14:00 - 20:00<br />
                  Sábados y Domingos: 10:00 - 22:00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Contact;
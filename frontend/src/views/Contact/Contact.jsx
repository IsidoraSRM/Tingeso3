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
        color: '#303030', 
        fontWeight: 700,
        textAlign: 'center',
        mb: 4,
        fontFamily: "'Outfit', sans-serif"
      }}>
        📞 Contacto
      </Typography>

      <Paper elevation={3} sx={{ 
        p: 4,
        borderRadius: 2,
        border: '2px solid #A3320A',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 20px rgba(163, 50, 10, 0.3)',
        backgroundColor: 'rgba(244, 245, 245, 0.8)'
      }}>
        <Typography variant="h5" sx={{ 
          color: '#303030', 
          fontWeight: 600,
          mb: 4,
          textAlign: 'center',
          fontFamily: "'Outfit', sans-serif"
        }}>
           Información de Contacto
        </Typography>

        <Grid container spacing={4}>
          <Grid size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocationOnIcon sx={{ color: '#A3320A', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030',
                  fontWeight: 600
                }}>
                   Dirección
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030' 
                }}>
                  Av. Undostres Norte 1234, Santiago, Región Metropolitana
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <PhoneIcon sx={{ color: '#A3320A', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030',
                  fontWeight: 600
                }}>
                   Teléfono
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030' 
                }}>
                  <Link 
                    href="tel:+56912345678" 
                    underline="hover" 
                    sx={{ 
                      color: '#A3320A',
                      fontFamily: "'Outfit', sans-serif",
                      '&:hover': {
                        color: '#303030'
                      }
                    }}
                    tabIndex={0}
                    aria-label="Llamar al número +56 9 1234 5678"
                  >
                    +56 9 1234 5678
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <EmailIcon sx={{ color: '#A3320A', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030',
                  fontWeight: 600
                }}>
                   Email
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030' 
                }}>
                  <Link 
                    href="mailto:kartingrmbusiness@gmail.com" 
                    underline="hover" 
                    sx={{ 
                      color: '#A3320A',
                      fontFamily: "'Outfit', sans-serif",
                      '&:hover': {
                        color: '#303030'
                      }
                    }}
                    tabIndex={0}
                    aria-label="Enviar email a kartingrmbusiness@gmail.com"
                  >
                    kartingrmbusiness@gmail.com
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <AccessTimeIcon sx={{ color: '#A3320A', fontSize: 36, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030',
                  fontWeight: 600
                }}>
                   Horarios
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontFamily: "'Outfit', sans-serif", 
                  color: '#303030' 
                }}>
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
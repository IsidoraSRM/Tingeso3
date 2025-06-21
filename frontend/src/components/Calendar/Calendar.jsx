import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid';

import reservationService from '../../services/reservation';

import './calendar.css';



function MyCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await reservationService.getAll(); // Llamar servicio para obtener las reservas
        const reservations = response.data;
        console.log(reservations); // Verificar que se resciban las reservas
        // Mapear los datos al formato  react-big-calendar
        const mappedEvents = reservations.map((reservation) => ({
          id: reservation.id_reservation,
          title: `Reserva para ${reservation.groupSize}`,
          start: new Date(`${reservation.date}T${reservation.startTime}`),
          end: new Date(`${reservation.date}T${reservation.endTime}`),
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    fetchEvents();
  }, []);
/*
#F4F5F5 blanco
#77B8B9 celeste
#CA5833 rojo
#C98F51 naranja
#3A3A4B gris oscuro

*/
  return (
    <div className="calendar-container" style={{ margin: 'auto', marginTop: '30px', maxWidth: '1700px' ,backgroundColor: '#fff', padding: '10px'}}>
      <FullCalendar  
        eventBackgroundColor="rgba(201, 143, 81, 0.5)"  
        eventBorderColor="rgba(201, 143, 81, 0.5)"       
      plugins={[ dayGridPlugin,timeGridPlugin]}
      initialView="dayGridMonth"
      
      slotMinTime="10:00:00"  // Hora de inicio
      slotMaxTime="23:00:00"  // Hora de fin
        headerToolbar={{
          left: 'prev next today',
          center: 'title',
          right: 'dayGridMonth timeGridWeek'
        }}
      events={events}
      eventDidMount={(info) => {
        info.el.setAttribute(
          'title',
          `Reserva: ${info.event.id}\nInicio: ${info.event.start.toLocaleString()}\nFin: ${info.event.end.toLocaleString()}`
        );
      }}
      views={{
        dayGridMonth: {
          contentHeight: 800 
        },
        timeGridWeek: {
          contentHeight: 700 
        }
      }}
      
    />
    </div>
  );
}

export default MyCalendar;
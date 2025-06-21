package cl.usach.isidora.backend.Dto;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

import cl.usach.isidora.backend.entities.CustomerEntity;
import lombok.Data;
// clase creada para recibir la informacion de una reserva con la informacion de un cliente
@Data
public class ReservationRequestDTO {
    private LocalDate date;
    private Time startTime;
    private Integer duration;
    private Integer groupSize;
    private List<CustomerEntity> customers;
}
package cl.usach.isidora.backend.controller;

import cl.usach.isidora.backend.Dto.ReservationRequestDTO;
import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.entities.ReservationEntity;
import cl.usach.isidora.backend.repositories.ReservationRepository;
import cl.usach.isidora.backend.services.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/reservation")
@CrossOrigin
public class ReservationController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    
    public ReservationController(ReservationRepository reservationRepository, 
                               ReservationService reservationService) {
        this.reservationRepository = reservationRepository;
        this.reservationService = reservationService;
    }
    

    @GetMapping("/all")
    public ResponseEntity<Object> getAllReservations() {
        try {
            
            List<ReservationEntity> reservations = reservationRepository.findAll();
            
            
            for (ReservationEntity r : reservations) {
                r.setCustomers(null);  
                r.setIndividualPrices(null); 
                r.setIndividualDscs(null); 
            }
            
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            logger.error("Error al obtener reservas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al obtener reservas: " + e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ReservationEntity createReservation(@RequestBody ReservationRequestDTO request) {
        return reservationService.createReservationWithCustomers(
                request.getDate(),
                request.getStartTime(),
                request.getDuration(),
                request.getGroupSize(),
                request.getCustomers()
        );
    }
    @PostMapping("/create2")
    public ReservationEntity createReservation2(@RequestBody ReservationRequestDTO request) {

        return reservationService.createReservationWithPricing(
                request.getDate(),
                request.getStartTime(),
                request.getDuration(),
                request.getGroupSize(),
                request.getCustomers()
        );
    }

    @GetMapping("/{id}/pricing")
    public ReservationEntity getReservationWithPricing(@PathVariable Long id) {
        logger.info("ESTE ES EL ID QUE SE ESTA PASANDO AL METODO ID: {}", id);
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        // Calcular precios
        ReservationEntity calculatedReservation = reservationService.calculatePricing(reservation);
        
        // Guardar los resultados en la base de datos
        return reservationRepository.save(calculatedReservation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getReservationById(@PathVariable Long id) {
        ReservationEntity reservation = reservationService.getReservationById(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No se encontró la reserva con ID: " + id));
        }
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Object> getCustomersByReservationId(@PathVariable Long id) {
        ReservationEntity reservation = reservationService.getReservationById(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No se encontró la reserva con ID: " + id));
        }
        List<CustomerEntity> customers = reservation.getCustomers();
        return ResponseEntity.ok(customers);

    }

    @GetMapping("/{id}/send-mail")
    public ResponseEntity<Object> sendReservationConfirmation(@PathVariable Long id) {
        try {
            // Verificar que la reserva existe
            ReservationEntity reservation = reservationService.getReservationById(id);
            if (reservation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No se encontró la reserva con ID: " + id));
            }
            
            // Enviar los correos de confirmación
            reservationService.sendReservationMail(id);
            
            return ResponseEntity.ok(Map.of(
                "message", "Correos de confirmación enviados correctamente",
                "reservationId", id
            ));
        } catch (Exception e) {
            logger.error("Error al enviar correos para reserva ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al enviar correos: " + e.getMessage()));
        }
    }


    @GetMapping("/reports/laps-time")
    public ResponseEntity<Map<String, Object>> getLapsTimeReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reservationService.generateLapsTimeReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/reports/group-size")
    public ResponseEntity<Map<String, Object>> getGroupSizeReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> report = reservationService.generateGroupSizeReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

}

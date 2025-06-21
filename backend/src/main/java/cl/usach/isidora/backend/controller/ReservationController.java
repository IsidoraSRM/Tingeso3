package cl.usach.isidora.backend.controller;

import cl.usach.isidora.backend.Dto.ReservationRequestDTO;
import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.entities.ReservationEntity;
import cl.usach.isidora.backend.repositories.ReservationRepository;
import cl.usach.isidora.backend.services.CustomerService;
import cl.usach.isidora.backend.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/reservation")
@CrossOrigin
public class ReservationController {
    @Autowired
    ReservationRepository reservationRepository;
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private CustomerService customerRepository;
    @GetMapping("/all")
    public ResponseEntity<?> getAllReservations() {
        try {
            
            List<ReservationEntity> reservations = reservationRepository.findAll();
            
            
            for (ReservationEntity r : reservations) {
                r.setCustomers(null);  
                r.setIndividualPrices(null); 
                r.setIndividualDscs(null); 
            }
            
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace(); 
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
        System.out.println("ESTE ES EL ID QUE SE ESTA PASANDO AL METODO ID: " + id);
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        // Calcular precios
        ReservationEntity calculatedReservation = reservationService.calculatePricing(reservation);
        
        // Guardar los resultados en la base de datos
        return reservationRepository.save(calculatedReservation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        ReservationEntity reservation = reservationService.getReservationById(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No se encontró la reserva con ID: " + id));
        }
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomersByReservationId(@PathVariable Long id) {
        ReservationEntity reservation = reservationService.getReservationById(id);
        if (reservation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No se encontró la reserva con ID: " + id));
        }
        List<CustomerEntity> customers = reservation.getCustomers();
        return ResponseEntity.ok(customers);

    }

    @GetMapping("/{id}/send-mail")
    public ResponseEntity<?> sendReservationConfirmation(@PathVariable Long id) {
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
            e.printStackTrace();
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

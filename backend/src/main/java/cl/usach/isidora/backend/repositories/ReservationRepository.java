package cl.usach.isidora.backend.repositories;

import cl.usach.isidora.backend.entities.ReservationEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<ReservationEntity,Long> {


    List<ReservationEntity> findByDateBetween(LocalDate startDate, LocalDate endDate);
     
    List<ReservationEntity> findAll();
    
    @EntityGraph(value = "Reservation.withCustomersAndPrices")
    Optional<ReservationEntity> findById(Long id);
}

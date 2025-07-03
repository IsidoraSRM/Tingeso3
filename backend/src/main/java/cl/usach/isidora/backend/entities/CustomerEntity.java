package cl.usach.isidora.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Customer")
public class CustomerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_customer;

    private String name;
    private String lastname;
    private String rut;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private LocalDate visitDate;
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    @JsonBackReference
    private ReservationEntity reservation;



}
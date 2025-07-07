package cl.usach.isidora.backend.entities;

import jakarta.persistence.*;
import lombok.*;


 @Entity
 @Getter
 @Setter
 @NoArgsConstructor
 @AllArgsConstructor
@Table(name = "Kart")
public class KartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_kart")
    private Long idKart;
    private String code; // K001...K015
    private String model;
    @Column(name="kart_state")
    private String kartState; // UnAvailable o available
     @Column(name="last_maintenance")
    private String lastMaintenance; // Active o InActive


}

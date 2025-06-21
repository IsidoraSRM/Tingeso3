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
    private Long id_kart;
    private String code; // K001...K015
    private String model;
    private String kart_state; // UnAvailable o available
    private String last_maintenance; // Active o InActive

    public KartEntity(String code, String model, String kart_state, String last_maintenance) {
        this.code = code;
        this.model = model;
        this.kart_state = kart_state;
        this.last_maintenance = last_maintenance;

    }





}

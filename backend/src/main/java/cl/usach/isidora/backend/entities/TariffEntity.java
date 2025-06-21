package cl.usach.isidora.backend.entities;

import jakarta.annotation.Generated;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "Tariff")
public class TariffEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_tariff;
    private Integer laps;
    @Column(name = "max_minutes")
    private Integer maxMinutes;
    private Integer price;
    private Integer total_duration;

}

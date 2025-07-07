package cl.usach.isidora.backend.entities;


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
    @Column(name = "id_tariff")
    private Long idTariff;
    private Integer laps;
    @Column(name = "max_minutes")
    private Integer maxMinutes;
    private Integer price;
    @Column(name = "total_duration")
    private Integer totalDuration;

}

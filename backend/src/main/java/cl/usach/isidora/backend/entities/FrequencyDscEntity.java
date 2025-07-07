package cl.usach.isidora.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FrequencyDsc")
public class FrequencyDscEntity {
    @Id
    @Column(name="IdFrequencyDsc")
    private Long idFrequencyDsc;
    private String frequencyType;
    private Integer minFrequency;
    private Integer maxFrequency;
    private Double discountPercentage; 

}

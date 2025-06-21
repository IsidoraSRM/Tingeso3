package cl.usach.isidora.backend.entities;



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
@Table(name = "GroupSizeDsc")
public class GroupSizeDscEntity {
    @Id
    private Long idGroupSizeDsc;
    private Integer minGroupSize;
    private Integer maxGroupSize;
    private Double discountPercentage; 
    
}

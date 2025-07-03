package cl.usach.isidora.backend.repositories;
import cl.usach.isidora.backend.entities.KartEntity;
import org.springframework.data.jpa.repository.JpaRepository;



public interface KartRepository extends JpaRepository<KartEntity,Long> {

}

package cl.usach.isidora.backend.repositories;
import cl.usach.isidora.backend.entities.KartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KartRepository extends JpaRepository<KartEntity,Long> {

}

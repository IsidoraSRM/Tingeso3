package cl.usach.isidora.backend.repositories;

import cl.usach.isidora.backend.entities.TariffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TariffRepository extends JpaRepository<TariffEntity, Long> {

    TariffEntity findByMaxMinutes(Integer maxMinutes);
}

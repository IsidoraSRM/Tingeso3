package cl.usach.isidora.backend.repositories;

import cl.usach.isidora.backend.entities.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {


    CustomerEntity getCustomerEntitiesByRutEquals(String rut);

    List<CustomerEntity> findByRut(String rut);


}

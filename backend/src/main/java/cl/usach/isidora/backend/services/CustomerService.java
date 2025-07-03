package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.repositories.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public class CustomerService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);
    private final CustomerRepository customerRepository;
    
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }


    public List<CustomerEntity> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void createCustomer(CustomerEntity customer) {
        customerRepository.save(customer);
        logger.info("Cliente creado: {}", customer);
    }

    public long countFrequentCustomers(CustomerEntity customer,LocalDate reservationDate) {
        long visitsInLast30Days = 0;
        List<CustomerEntity> customers = customerRepository.findAll();
        // Obtener todas las visitas del cliente
        // Calcular el rango de fechas
        LocalDate thirtyDaysAgo = reservationDate.minusDays(30);
        
        for (CustomerEntity c : customers){
            if(c.getRut().equals(customer.getRut())){
                if(c.getVisitDate() != null) {
                    LocalDate visitDate = c.getVisitDate();
                    // Verificar si la visita es dentro del mes actual
                    if ((visitDate.isAfter(thirtyDaysAgo) || visitDate.isEqual(thirtyDaysAgo)) &&
                        (visitDate.isBefore(reservationDate) || visitDate.isEqual(reservationDate))) {
                        visitsInLast30Days++;
                    }
                } else {
                    logger.warn("La fecha de visita es nula para el cliente con RUT: {}", c.getRut());
                }
            }
        }
        // Contar las visitas dentro del mes actual
        logger.info("El cliente ha visitado: {}", visitsInLast30Days);
        return visitsInLast30Days;
    }


    

}

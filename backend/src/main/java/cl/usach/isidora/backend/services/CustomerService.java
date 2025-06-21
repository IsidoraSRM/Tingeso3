package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;


    public List<CustomerEntity> getAllCustomers() {
        return customerRepository.findAll();
    }

    public void createCustomer(CustomerEntity customer) {
        customerRepository.save(customer);
        System.out.println(customer);
    }

    public long countFrequentCustomers(CustomerEntity customer,LocalDate reservationDate) {
        LocalDate currentDate = LocalDate.now();
        long visitsInLast30Days = 0;
        List<CustomerEntity> customers = customerRepository.findAll();
        // Obtener todas las visitas del cliente
        // Calcular el rango de fechas
        LocalDate thirtyDaysAgo = reservationDate.minusDays(30);
        List<CustomerEntity> customerVisits = customerRepository.findByRut(customer.getRut());
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
                    System.out.println("La fecha de visita es nula para el cliente con RUT: " + c.getRut());

                }

            }
        }
        // Contar las visitas dentro del mes actual
        System.out.println("El cliente ha vistado: "+visitsInLast30Days);
        return visitsInLast30Days;
        }


    

}

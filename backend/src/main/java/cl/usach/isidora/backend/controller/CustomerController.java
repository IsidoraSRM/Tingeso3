package cl.usach.isidora.backend.controller;

import cl.usach.isidora.backend.services.CustomerService;
import cl.usach.isidora.backend.entities.CustomerEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customer")
@CrossOrigin
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;
    
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/all")
    public List<CustomerEntity> getAllCustomers() {
        List<CustomerEntity> customers = customerService.getAllCustomers();
        if (!customers.isEmpty()) {
            logger.info("First customer birthdate: {}", customers.get(0).getBirthdate());
        }
        return customers;
    }

    @PostMapping("/create")
    public void createCustomer(@RequestBody CustomerEntity customer) {
        logger.info("Cliente recibido: {}", customer);
        customerService.createCustomer(customer); // Llama al servicio para guardar el cliente
    }
}

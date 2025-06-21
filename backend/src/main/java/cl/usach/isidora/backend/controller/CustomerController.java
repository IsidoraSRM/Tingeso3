package cl.usach.isidora.backend.controller;

import cl.usach.isidora.backend.services.CustomerService;
import cl.usach.isidora.backend.entities.CustomerEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customer")
@CrossOrigin
public class CustomerController {


    @Autowired
    private CustomerService customerService;

    @GetMapping("/all")
    public List<CustomerEntity> getAllCustomers() {
        System.out.println(customerService.getAllCustomers().get(0).getBirthdate().toString());
        return customerService.getAllCustomers();
    }

    @PostMapping("/create")
    public void createCustomer(@RequestBody CustomerEntity customer) {
        System.out.println("Cliente recibido: " + customer);
        customerService.createCustomer(customer); // Llama al servicio para guardar el cliente
    }
}

package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.CustomerEntity;
import cl.usach.isidora.backend.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;






class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCustomers_ShouldReturnAllCustomers() {
        
        List<CustomerEntity> expectedCustomers = new ArrayList<>();
        expectedCustomers.add(new CustomerEntity());
        expectedCustomers.add(new CustomerEntity());
        when(customerRepository.findAll()).thenReturn(expectedCustomers);
        
        
        List<CustomerEntity> actualCustomers = customerService.getAllCustomers();
        
        
        assertEquals(expectedCustomers, actualCustomers);
        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void createCustomer_ShouldSaveCustomer() {
        
        CustomerEntity customer = new CustomerEntity();
        customer.setRut("12345678-9");
        
        
        customerService.createCustomer(customer);
        
        
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void countFrequentCustomers_WithVisitsInLast30Days_ShouldReturnCorrectCount() {
        
        LocalDate reservationDate = LocalDate.now();
        CustomerEntity targetCustomer = new CustomerEntity();
        targetCustomer.setRut("12345678-9");
        
        // Create visits at different times
        CustomerEntity visit1 = new CustomerEntity();
        visit1.setRut("12345678-9");
        visit1.setVisitDate(reservationDate.minusDays(5));
        
        CustomerEntity visit2 = new CustomerEntity();
        visit2.setRut("12345678-9");
        visit2.setVisitDate(reservationDate.minusDays(15));
        
        CustomerEntity visit3 = new CustomerEntity();
        visit3.setRut("12345678-9");
        visit3.setVisitDate(reservationDate.minusDays(35)); // fuera de los 30 dias
        
        CustomerEntity differentCustomer = new CustomerEntity();
        differentCustomer.setRut("98765432-1");
        differentCustomer.setVisitDate(reservationDate.minusDays(10));
        
        List<CustomerEntity> allCustomers = Arrays.asList(visit1, visit2, visit3, differentCustomer);
        
        when(customerRepository.findAll()).thenReturn(allCustomers);
        when(customerRepository.findByRut("12345678-9")).thenReturn(Arrays.asList(visit1, visit2, visit3));
        
        
        long count = customerService.countFrequentCustomers(targetCustomer, reservationDate);
        
        
        assertEquals(2, count); // solo la visita 1 y 2 cuentan
    }
    
    @Test
    void countFrequentCustomers_WithNoVisitsInLast30Days_ShouldReturnZero() {
        
        LocalDate reservationDate = LocalDate.now();
        CustomerEntity targetCustomer = new CustomerEntity();
        targetCustomer.setRut("12345678-9");
        
        CustomerEntity oldVisit = new CustomerEntity();
        oldVisit.setRut("12345678-9");
        oldVisit.setVisitDate(reservationDate.minusDays(35)); // Vsisita fuera de los 30 días
        
        List<CustomerEntity> allCustomers = Arrays.asList(oldVisit);
        
        when(customerRepository.findAll()).thenReturn(allCustomers);
        when(customerRepository.findByRut("12345678-9")).thenReturn(Arrays.asList(oldVisit));
        
        
        long count = customerService.countFrequentCustomers(targetCustomer, reservationDate);
        
        
        assertEquals(0, count);
    }
    
    @Test
    void countFrequentCustomers_WithNullVisitDate_ShouldHandleGracefully() {
        
        LocalDate reservationDate = LocalDate.now();
        CustomerEntity targetCustomer = new CustomerEntity();
        targetCustomer.setRut("12345678-9");
        
        CustomerEntity visitWithNullDate = new CustomerEntity();
        visitWithNullDate.setRut("12345678-9");
        visitWithNullDate.setVisitDate(null);
        
        List<CustomerEntity> allCustomers = Arrays.asList(visitWithNullDate);
        
        when(customerRepository.findAll()).thenReturn(allCustomers);
        when(customerRepository.findByRut("12345678-9")).thenReturn(Arrays.asList(visitWithNullDate));
        
        
        long count = customerService.countFrequentCustomers(targetCustomer, reservationDate);
        
        
        assertEquals(0, count);
    }
}

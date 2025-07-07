package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.*;
import cl.usach.isidora.backend.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {
    
    @Mock
    private ReservationRepository reservationRepository;
    
    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private TariffRepository tariffRepository;
    
    @Mock
    private CustomerService customerService;
    
    @Mock
    private FrequencyDscService frequencyDscService;
    
    @Mock
    private GroupSizeDscService groupSizeDscService;
    
    @Mock
    private TariffService tariffService;
    
    @Mock
    private JavaMailSender emailSender;
    
    @InjectMocks
    private ReservationService reservationService;
    
    private ReservationEntity testReservation;
    private CustomerEntity testCustomer1, testCustomer2;
    private TariffEntity testTariff;
    private List<CustomerEntity> testCustomers;
    
    @BeforeEach
    void setup() {
        // Configurar datos de prueba
        testCustomer1 = new CustomerEntity();
        testCustomer1.setIdCustomer(1L);
        testCustomer1.setName("Juan");
        testCustomer1.setLastname("Pérez");
        testCustomer1.setEmail("juan@example.com");
        testCustomer1.setBirthdate(LocalDate.of(1990, 4, 15));
        
        testCustomer2 = new CustomerEntity();
        testCustomer2.setIdCustomer(2L);
        testCustomer2.setName("María");
        testCustomer2.setLastname("González");
        testCustomer2.setEmail("maria@example.com");
        testCustomer2.setBirthdate(LocalDate.of(1985, 6, 20));
        
        testCustomers = Arrays.asList(testCustomer1, testCustomer2);
        
        testReservation = new ReservationEntity();
        testReservation.setIdReservation(1L);
        testReservation.setDate(LocalDate.of(2024, 4, 15));
        testReservation.setStartTime(Time.valueOf("14:00:00"));
        testReservation.setEndTime(Time.valueOf("14:30:00"));
        testReservation.setGroupSize(2);
        testReservation.setBaseTariff(5000);
        testReservation.setTotalAmount(8000.0);
        testReservation.setCustomers(testCustomers);
        testReservation.setIndividualDscs(Arrays.asList(10.0, 20.0));
        testReservation.setIndividualPrices(Arrays.asList(4500.0, 4000.0));
        
        testTariff = new TariffEntity();
        testTariff.setIdTariff(1L);
        testTariff.setLaps(10);
        testTariff.setMaxMinutes(30);
        testTariff.setPrice(5000);
        testTariff.setTotalDuration(30);
    }
    
    @Test
    void testGetAllReservations() {
        
        when(reservationRepository.findAll()).thenReturn(Arrays.asList(testReservation));
        
        
        List<ReservationEntity> result = reservationService.getAllReservations();
        
        
        assertEquals(1, result.size());
        assertEquals(testReservation.getIdReservation(), result.get(0).getIdReservation());
        verify(reservationRepository).findAll();
    }
    
    @Test
    void testGetReservationById() {
        
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
        when(reservationRepository.findById(2L)).thenReturn(Optional.empty());
        
        
        ReservationEntity found = reservationService.getReservationById(1L);
        ReservationEntity notFound = reservationService.getReservationById(2L);
        
        
        assertNotNull(found);
        assertEquals(1L, found.getIdReservation());
        assertNull(notFound);
        verify(reservationRepository).findById(1L);
        verify(reservationRepository).findById(2L);
    }
    
    @Test
    void testCreateReservationWithCustomers() {
        
        LocalDate date = LocalDate.of(2024, 5, 1);
        Time startTime = Time.valueOf("15:00:00");
        int duration = 30;
        int groupSize = 2;
        List<CustomerEntity> customers = new ArrayList<>(testCustomers);
        
        when(tariffRepository.findByMaxMinutes(duration)).thenReturn(testTariff);
        when(reservationRepository.save(any(ReservationEntity.class))).thenAnswer(invocation -> {
            ReservationEntity savedReservation = invocation.getArgument(0);
            savedReservation.setIdReservation(1L);
            return savedReservation;
        });
        
        
        ReservationEntity result = reservationService.createReservationWithCustomers(
                date, startTime, duration, groupSize, customers);
        
        
        assertNotNull(result);
        assertEquals(date, result.getDate());
        assertEquals(startTime, result.getStartTime());
        assertEquals(Time.valueOf("15:30:00"), result.getEndTime());
        assertEquals(groupSize, result.getGroupSize());
        assertEquals(testTariff.getPrice(), result.getBaseTariff());
        assertEquals(customers, result.getCustomers());
        
        verify(tariffRepository).findByMaxMinutes(duration);
        verify(reservationRepository).save(any(ReservationEntity.class));
    }
    
    @Test
    void testCalculatePricing() {
        // Crear un spy del servicio
        ReservationService spyReservationService = spy(reservationService);
        
        // usar el spy para simular el comportamiento de los métodos
        doReturn(Arrays.asList(5.0, 5.0)).when(spyReservationService).getCustomerGroup(any(), any());
        doReturn(Arrays.asList(5.0, 10.0)).when(spyReservationService).getCustomerFreq(any(), any());
        doReturn(Arrays.asList(0.0, 0.0)).when(spyReservationService).getCustomerBirthDay(any(), any());
        
        ReservationEntity reservation = new ReservationEntity();
        reservation.setIdReservation(3L);
        reservation.setBaseTariff(5000);
        reservation.setCustomers(testCustomers);
        
        // usar el spy para llamar al método
        ReservationEntity result = spyReservationService.calculatePricing(reservation);
        
        
        assertNotNull(result);
        assertNotNull(result.getTotalAmount());
        assertNotNull(result.getIndividualDscs());
        assertNotNull(result.getIndividualPrices());
        assertEquals(2, result.getIndividualDscs().size());
        assertEquals(2, result.getIndividualPrices().size());
        
        // Verificar que el descuento aplicado es el mayor (5% para el primer cliente, 10% para el segundo)
        assertEquals(5.0, result.getIndividualDscs().get(0));
        assertEquals(10.0, result.getIndividualDscs().get(1));
        
        // Verificar que se llamaron los métodos mockeados del spy
        verify(spyReservationService).getCustomerGroup(any(), any());
        verify(spyReservationService).getCustomerFreq(any(), any());
        verify(spyReservationService).getCustomerBirthDay(any(), any());
    }
    
    @Test
    void testGetTariffByDuration_ExactMatch() {
        
        int duration = 30;
        when(tariffRepository.findByMaxMinutes(duration)).thenReturn(testTariff);
        
        
        Integer result = reservationService.getTariffByDuration(duration);
        
        
        assertEquals(testTariff.getPrice(), result);
        verify(tariffRepository).findByMaxMinutes(duration);
    }
    
    @Test
    void testGetTariffByDuration_NoMatch() {
        
        int duration = 45;
        when(tariffRepository.findByMaxMinutes(duration)).thenReturn(null);
        
        List<TariffEntity> allTariffs = new ArrayList<>();
        TariffEntity tariff1 = new TariffEntity();
        tariff1.setIdTariff(1L);
        tariff1.setTotalDuration(30);
        tariff1.setPrice(5000);
        
        TariffEntity tariff2 = new TariffEntity();
        tariff2.setIdTariff(2L);
        tariff2.setTotalDuration(60);
        tariff2.setPrice(8000);
        
        allTariffs.add(tariff1);
        allTariffs.add(tariff2);
        
        when(tariffService.getAllTariffs()).thenReturn(allTariffs);
        
        
        Integer result = reservationService.getTariffByDuration(duration);
        
        
        assertEquals(5000, result); 
        verify(tariffRepository).findByMaxMinutes(duration);
        verify(tariffService).getAllTariffs();
    }
    
    @Test
    void testGetCustomersByReservationId() {
        
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
        when(reservationRepository.findById(2L)).thenReturn(Optional.empty());
        
        
        List<CustomerEntity> found = reservationService.getCustomersByReservationId(1L);
        List<CustomerEntity> notFound = reservationService.getCustomersByReservationId(2L);
        
        
        assertNotNull(found);
        assertEquals(2, found.size());
        assertEquals(testCustomers, found);
        assertTrue(notFound.isEmpty());
        
        verify(reservationRepository).findById(1L);
        verify(reservationRepository).findById(2L);
    }
    
    @Test
    void testSendReservationMail() throws Exception {
        
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
        
        // Mock para JavaMailSender
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
        
        
        reservationService.sendReservationMail(1L);
        
        
        verify(reservationRepository).findById(1L);
        verify(emailSender, times(2)).createMimeMessage();
        verify(emailSender, times(2)).send(any(MimeMessage.class));
    }
}
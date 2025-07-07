package cl.usach.isidora.backend.services;
import cl.usach.isidora.backend.entities.TariffEntity;
import cl.usach.isidora.backend.repositories.TariffRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;






class TariffServiceTest {
    
    @Mock
    private TariffRepository tariffRepository;
    
    @InjectMocks
    private TariffService tariffService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void getAllTariffs_ShouldReturnAllTariffs() {
        
        List<TariffEntity> expectedTariffs = new ArrayList<>();
        TariffEntity tariff1 = new TariffEntity();
        tariff1.setMaxMinutes(30);
        tariff1.setPrice(5000);
        
        TariffEntity tariff2 = new TariffEntity();
        tariff2.setMaxMinutes(60);
        tariff2.setPrice(8000);
        
        expectedTariffs.add(tariff1);
        expectedTariffs.add(tariff2);
        
        when(tariffRepository.findAll()).thenReturn(expectedTariffs);
        
        
        List<TariffEntity> actualTariffs = tariffService.getAllTariffs();
        
        
        assertEquals(expectedTariffs, actualTariffs);
        verify(tariffRepository, times(1)).findAll();
    }
    
    @Test
    void getTariffEntityByMaxMinutes_ShouldReturnCorrectTariff() {
        
        Integer minutes = 30;
        TariffEntity expectedTariff = new TariffEntity();
        expectedTariff.setMaxMinutes(minutes);
        expectedTariff.setPrice(5000);
        
        when(tariffRepository.findByMaxMinutes(minutes)).thenReturn(expectedTariff);
        
        
        TariffEntity actualTariff = tariffService.getTariffEntityByMaxMinutes(minutes);
        
        
        assertEquals(expectedTariff, actualTariff);
        verify(tariffRepository, times(1)).findByMaxMinutes(minutes);
    }
    
    @Test
    void getTariffEntityByMaxMinutes_WithNonExistentMinutes_ShouldHandleGracefully() {
        
        Integer minutes = 45; // Asumiendo que no existe un tariff con 45 minutos
        TariffEntity expectedTariff = new TariffEntity();
        expectedTariff.setMaxMinutes(60); // la siguiente tarifa que existe
        expectedTariff.setPrice(8000);
        
        when(tariffRepository.findByMaxMinutes(minutes)).thenReturn(expectedTariff);
        
        
        TariffEntity actualTariff = tariffService.getTariffEntityByMaxMinutes(minutes);
        
        
        assertEquals(expectedTariff, actualTariff);
        verify(tariffRepository, times(1)).findByMaxMinutes(minutes);
    }
}

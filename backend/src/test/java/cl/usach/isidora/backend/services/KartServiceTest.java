package cl.usach.isidora.backend.services;
import cl.usach.isidora.backend.entities.KartEntity;
import cl.usach.isidora.backend.repositories.KartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;






public class KartServiceTest {
    
    @InjectMocks
    private KartService kartService;
    
    @Mock
    private KartRepository kartRepository;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testGetAllKarts() {
        
        List<KartEntity> expectedList = new ArrayList<>();
        KartEntity kart1 = new KartEntity();
        KartEntity kart2 = new KartEntity();
        expectedList.add(kart1);
        expectedList.add(kart2);
        
        when(kartRepository.findAll()).thenReturn(expectedList);
        
        
        List<KartEntity> result = kartService.getAllKarts();
        
        
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedList, result);
        verify(kartRepository, times(1)).findAll();
    }
    
    @Test
    public void testGetAllKarts_EmptyList() {
        
        List<KartEntity> emptyList = new ArrayList<>();
        when(kartRepository.findAll()).thenReturn(emptyList);
        
        
        List<KartEntity> result = kartService.getAllKarts();
        
        
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(kartRepository, times(1)).findAll();
    }
}

package cl.usach.isidora.backend.services;
import cl.usach.isidora.backend.entities.FrequencyDscEntity;
import cl.usach.isidora.backend.repositories.FrequencyDscRepository;
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






public class FrequencyDscServiceTest {
    
    @InjectMocks
    private FrequencyDscService frequencyDscService;
    
    @Mock
    private FrequencyDscRepository frequencyDscRepository;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testGetAllFrequencyDsc() {
        
        List<FrequencyDscEntity> expectedList = new ArrayList<>();
        FrequencyDscEntity entity1 = new FrequencyDscEntity();
        FrequencyDscEntity entity2 = new FrequencyDscEntity();
        expectedList.add(entity1);
        expectedList.add(entity2);
        
        when(frequencyDscRepository.findAll()).thenReturn(expectedList);
        
        
        List<FrequencyDscEntity> result = frequencyDscService.getAllFrequencyDsc();
        
        
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedList, result);
        verify(frequencyDscRepository, times(1)).findAll();
    }
    
    @Test
    public void testGetAllFrequencyDsc_EmptyList() {
        
        List<FrequencyDscEntity> emptyList = new ArrayList<>();
        when(frequencyDscRepository.findAll()).thenReturn(emptyList);
        
        
        List<FrequencyDscEntity> result = frequencyDscService.getAllFrequencyDsc();
        
        
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(frequencyDscRepository, times(1)).findAll();
    }
}

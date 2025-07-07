package cl.usach.isidora.backend.services;
import cl.usach.isidora.backend.entities.GroupSizeDscEntity;
import cl.usach.isidora.backend.repositories.GroupSizeDscRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;






class GroupSizeDscServiceTest {
    
    @Mock
    private GroupSizeDscRepository groupSizeDscRepository;
    
    @InjectMocks
    private GroupSizeDscService groupSizeDscService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void getAllGroupSizeDsc_ShouldReturnAllDiscounts() {
        
        List<GroupSizeDscEntity> expectedDiscounts = new ArrayList<>();
        GroupSizeDscEntity discount1 = new GroupSizeDscEntity();
        discount1.setMinGroupSize(4);
        discount1.setMaxGroupSize(6);
        discount1.setDiscountPercentage(5.0);
        
        GroupSizeDscEntity discount2 = new GroupSizeDscEntity();
        discount2.setMinGroupSize(7);
        discount2.setMaxGroupSize(10);
        discount2.setDiscountPercentage(10.0);
        
        expectedDiscounts.add(discount1);
        expectedDiscounts.add(discount2);
        
        when(groupSizeDscRepository.findAll()).thenReturn(expectedDiscounts);
        
        
        List<GroupSizeDscEntity> actualDiscounts = groupSizeDscService.getAllGroupSizeDsc();
        
        
        assertEquals(expectedDiscounts, actualDiscounts);
        verify(groupSizeDscRepository, times(1)).findAll();
    }
    
    @Test
    void getAllGroupSizeDsc_WithEmptyList_ShouldReturnEmptyList() {
        
        List<GroupSizeDscEntity> emptyList = new ArrayList<>();
        when(groupSizeDscRepository.findAll()).thenReturn(emptyList);
        
        
        List<GroupSizeDscEntity> result = groupSizeDscService.getAllGroupSizeDsc();
        
        
        assertEquals(0, result.size());
        verify(groupSizeDscRepository, times(1)).findAll();
    }
}

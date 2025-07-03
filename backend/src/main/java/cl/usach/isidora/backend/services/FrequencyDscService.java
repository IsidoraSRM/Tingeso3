package cl.usach.isidora.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import cl.usach.isidora.backend.entities.FrequencyDscEntity;
import cl.usach.isidora.backend.repositories.FrequencyDscRepository;

@Service
public class FrequencyDscService {

    private final FrequencyDscRepository frequencyDscRepository;
    
    public FrequencyDscService(FrequencyDscRepository frequencyDscRepository) {
        this.frequencyDscRepository = frequencyDscRepository;
    }

    public List<FrequencyDscEntity> getAllFrequencyDsc() {
        return frequencyDscRepository.findAll();
    }

}

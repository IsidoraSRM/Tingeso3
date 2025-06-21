package cl.usach.isidora.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.usach.isidora.backend.entities.FrequencyDscEntity;
import cl.usach.isidora.backend.repositories.FrequencyDscRepository;

@Service
public class FrequencyDscService {

    @Autowired
    private FrequencyDscRepository frequencyDscRepository;

    public List<FrequencyDscEntity> getAllFrequencyDsc() {
        return frequencyDscRepository.findAll();
    }

}

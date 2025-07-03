package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.KartEntity;
import cl.usach.isidora.backend.repositories.KartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class KartService {
    
    private final KartRepository kartRepository;
    
    public KartService(KartRepository kartRepository) {
        this.kartRepository = kartRepository;
    }


    public List<KartEntity> getAllKarts() {
        return kartRepository.findAll();
    }
}

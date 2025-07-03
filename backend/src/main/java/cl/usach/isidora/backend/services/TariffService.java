package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.TariffEntity;
import cl.usach.isidora.backend.repositories.TariffRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TariffService {
    
    private static final Logger logger = LoggerFactory.getLogger(TariffService.class);
    private final TariffRepository tariffRepository;
    
    public TariffService(TariffRepository tariffRepository) {
        this.tariffRepository = tariffRepository;
    }

    public List<TariffEntity> getAllTariffs() {
        return tariffRepository.findAll();
    }

    public TariffEntity getTariffEntityByMaxMinutes(Integer minutes) {
        TariffEntity tariffEntity = tariffRepository.findByMaxMinutes(minutes);
        logger.info("Esta es la tarifa: {}", tariffEntity.getPrice());
        return tariffEntity;
    }
}

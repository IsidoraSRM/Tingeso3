package cl.usach.isidora.backend.services;

import cl.usach.isidora.backend.entities.TariffEntity;
import cl.usach.isidora.backend.repositories.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TariffService {
    @Autowired
    TariffRepository tariffRepository;

    public List<TariffEntity> getAllTariffs() {
        return tariffRepository.findAll();
    }

    public TariffEntity getTariffEntityByMax_minutes(Integer minutes) {
        TariffEntity tariffEntity = tariffRepository.findByMaxMinutes(minutes);
        System.out.println("esta es la tarifa : " + tariffEntity.getPrice());
        return tariffEntity;
    }
}

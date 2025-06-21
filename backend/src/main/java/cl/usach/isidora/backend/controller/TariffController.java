package cl.usach.isidora.backend.controller;

import cl.usach.isidora.backend.entities.TariffEntity;
import cl.usach.isidora.backend.services.TariffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/tariff")
@CrossOrigin
public class TariffController {
    @Autowired
    TariffService tariffService;

    @GetMapping("/all")
    public List<TariffEntity> getAllTariffs() {
        return tariffService.getAllTariffs();
    }

    @GetMapping("/ByMinute")
    public TariffEntity getTariffEntityByMinutes(@RequestParam Integer minutes) {
        return tariffService.getTariffEntityByMax_minutes(minutes);
    }

}

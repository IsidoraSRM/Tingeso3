package cl.usach.isidora.backend.controller;


import cl.usach.isidora.backend.entities.KartEntity;
import cl.usach.isidora.backend.services.KartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/kart")
@CrossOrigin
public class KartController {
    
    private static final Logger logger = LoggerFactory.getLogger(KartController.class);
    private final KartService kartService;
    
    public KartController(KartService kartService) {
        this.kartService = kartService;
    }

    @GetMapping("/all")
    public List<KartEntity> getAllKarts() {
        List<KartEntity> karts = kartService.getAllKarts();
        
        logger.info("Datos recuperados: ");
        karts.forEach(k -> logger.info(
                "ID: {}, Code: {}, Model: {}",
                k.getIdKart(), k.getCode(), k.getModel()
        ));
        return karts;
    }

}

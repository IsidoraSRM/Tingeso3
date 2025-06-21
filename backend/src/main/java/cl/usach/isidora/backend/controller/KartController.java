package cl.usach.isidora.backend.controller;


import cl.usach.isidora.backend.entities.KartEntity;
import cl.usach.isidora.backend.services.KartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/kart")
@CrossOrigin
public class KartController {
    @Autowired
    private KartService kartService;

    @GetMapping("/all")
    public List<KartEntity> getAllKarts() {
        List<KartEntity> karts = kartService.getAllKarts();
        
        System.out.println("Datos recuperados: ");
        karts.forEach(k -> System.out.println(
                "ID: " + k.getId_kart() +
                        ", Code: " + k.getCode() +
                        ", Model: " + k.getModel()
        ));
        return karts;
    }

}

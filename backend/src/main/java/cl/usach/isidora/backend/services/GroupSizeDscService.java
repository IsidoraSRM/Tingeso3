package cl.usach.isidora.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.usach.isidora.backend.entities.GroupSizeDscEntity;
import cl.usach.isidora.backend.repositories.GroupSizeDscRepository;

@Service
public class GroupSizeDscService {

    @Autowired
    private GroupSizeDscRepository groupSizeDscRepository;

    public List<GroupSizeDscEntity> getAllGroupSizeDsc() {
        return groupSizeDscRepository.findAll();
    }
}

package cl.usach.isidora.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import cl.usach.isidora.backend.entities.GroupSizeDscEntity;
import cl.usach.isidora.backend.repositories.GroupSizeDscRepository;

@Service
public class GroupSizeDscService {

    private final GroupSizeDscRepository groupSizeDscRepository;
    
    public GroupSizeDscService(GroupSizeDscRepository groupSizeDscRepository) {
        this.groupSizeDscRepository = groupSizeDscRepository;
    }

    public List<GroupSizeDscEntity> getAllGroupSizeDsc() {
        return groupSizeDscRepository.findAll();
    }
}

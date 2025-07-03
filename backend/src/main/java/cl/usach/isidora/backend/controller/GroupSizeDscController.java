package cl.usach.isidora.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.usach.isidora.backend.entities.GroupSizeDscEntity;
import cl.usach.isidora.backend.services.GroupSizeDscService;

@RestController
@RequestMapping("api/groupsizedsc")
@CrossOrigin
public class GroupSizeDscController {
    
    private final GroupSizeDscService groupSizeDscService;
    
    public GroupSizeDscController(GroupSizeDscService groupSizeDscService) {
        this.groupSizeDscService = groupSizeDscService;
    }

    @GetMapping("all")
    public List<GroupSizeDscEntity> getAllGroupSizeDsc() {
        return groupSizeDscService.getAllGroupSizeDsc();
    }

}

package com.ex.bug_tracker_security_basic_auth.controller;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.ex.bug_tracker_security_basic_auth.dto.BugResponseDTO;
import com.ex.bug_tracker_security_basic_auth.entity.Bug;
import com.ex.bug_tracker_security_basic_auth.service.BugService;
import org.springframework.http.ResponseEntity;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/bugs")    
public class BugController {
    private final BugService bugService;

    public BugController(BugService bugService){
        this.bugService = bugService;
    }
    @GetMapping("/filter")
    public ResponseEntity<List<BugResponseDTO>> getAllByFilter(@RequestParam(required = false) String status, @RequestParam(required = false) String assignee, @RequestParam(required = false) String project){
        return ResponseEntity.ok(bugService.filterBugs(status, assignee, project));
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<BugResponseDTO> getBugById(@PathVariable Long id){
        return ResponseEntity.ok(bugService.getBugById(id));
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BugResponseDTO>> getBugByStatus(@PathVariable String status){
        return ResponseEntity.ok(bugService.getByStatus(status));
    }
    
    @GetMapping("/assignee/{assignee}")
    public ResponseEntity<List<BugResponseDTO>> getBugsByAssignee(@PathVariable String assignee){
        return ResponseEntity.ok(bugService.getByAssignee(assignee));
    }
    
    @GetMapping("/project/{project}")
    public ResponseEntity<List<BugResponseDTO>> getBugsByProject(@PathVariable String project){
        return ResponseEntity.ok(bugService.getByProject(project));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BugResponseDTO>> searchBugs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee, 
            @RequestParam(required = false) String project,
            @PageableDefault(size = 10, sort = "title") Pageable pageable){
        return ResponseEntity.ok(bugService.searchBugs(status, assignee, project, pageable));
    }
    
    @GetMapping
    public ResponseEntity<Page<BugResponseDTO>> getAllBugs(
            @PageableDefault(size = 5, sort = "title") Pageable pageable){
        return ResponseEntity.ok(bugService.getAllBugs(pageable));
    }
    
    @GetMapping("/slice")
    public ResponseEntity<Slice<BugResponseDTO>> getAllBugsSlice(
            @PageableDefault(size = 5, sort = "title") Pageable pageable){
        return ResponseEntity.ok(bugService.getAllBugsSlice(pageable));
    }
    
    @GetMapping("/metadata")
    public ResponseEntity<Object> getBugsMetadata(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee,
            @RequestParam(required = false) String project,
            @PageableDefault(size = 10) Pageable pageable){
        return ResponseEntity.ok(bugService.getBugsMetadata(status, assignee, project, pageable));
    }
    @PostMapping("/admin")
    public ResponseEntity<Bug> createBug(@RequestBody Bug bug) {
        return ResponseEntity.ok(bugService.createBug(bug));
    }
    
    @PutMapping("/admin/{id}")
    public ResponseEntity<Bug> updateBug(@PathVariable Long id, @RequestBody Bug bug) {
        return ResponseEntity.ok(bugService.updateBug(id, bug));
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.ok("Bug deleted successfully");
    }
    
    @PutMapping("/developer/{id}/status")
    public ResponseEntity<Bug> updateBugStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(bugService.updateBugStatus(id, status));
    }
}

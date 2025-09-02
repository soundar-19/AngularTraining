package com.ex.bug_tracker_security_basic_auth.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

import com.ex.bug_tracker_security_basic_auth.dto.BugResponseDTO;
import com.ex.bug_tracker_security_basic_auth.entity.Bug;
import com.ex.bug_tracker_security_basic_auth.repository.BugRepository;

@Service
public class BugService {
    private final BugRepository bugRepository;
    
    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    //LINQ for filter
    public List<BugResponseDTO> filterBugs(String status, String assignee, String project){
        return bugRepository.findAll().stream()
        .filter(bug -> status == null || bug.getStatus().equalsIgnoreCase(status))
        .filter(bug -> assignee == null || bug.getAssignee().equalsIgnoreCase(assignee))
        .filter(bug -> project == null || bug.getProject().equalsIgnoreCase(project))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getStatus(), bug.getAssignee(), bug.getProject()))
        .toList();
    }

    public List<BugResponseDTO> getByStatus(String status) {
        return bugRepository.findAll().stream()
        .filter(bug-> bug.getStatus().equalsIgnoreCase(status))
        .map(bug -> new BugResponseDTO(bug.getId(),bug.getTitle(),bug.getStatus(),bug.getAssignee(),bug.getProject())).toList();
    }

    public BugResponseDTO getBugById(Long id){
        return bugRepository.findById(id)
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getStatus(), bug.getAssignee(), bug.getProject()))
        .orElse(null);
    }   

    public List<BugResponseDTO> getByAssignee(String assignee) {
        return bugRepository.findAll().stream()
        .filter(bug -> bug.getAssignee().equalsIgnoreCase(assignee))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getStatus(), bug.getAssignee(), bug.getProject())).toList();
    }

    public List<BugResponseDTO> getByProject(String project) {
        return bugRepository.findAll().stream()
        .filter(bug -> bug.getProject().equalsIgnoreCase(project))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getStatus(), bug.getAssignee(), bug.getProject())).toList();
    }

    public Page<BugResponseDTO> getAllBugs(Pageable pageable){
        return bugRepository.findAll(pageable).map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getStatus(), bug.getAssignee(), bug.getProject()));
    }
    
    public Page<BugResponseDTO> searchBugs(String status, String assignee, String project, Pageable pageable){
        List<BugResponseDTO> filtered = filterBugs(status, assignee, project);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<BugResponseDTO> pageContent = filtered.subList(start, end);
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }
    
    public Slice<BugResponseDTO> getAllBugsSlice(Pageable pageable){
        Page<BugResponseDTO> page = getAllBugs(pageable);
        return new SliceImpl<>(page.getContent(), pageable, page.hasNext());
    }
    
    public Map<String, Object> getBugsMetadata(String status, String assignee, String project, Pageable pageable){
        Page<BugResponseDTO> page = searchBugs(status, assignee, project, pageable);
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("totalElements", page.getTotalElements());
        metadata.put("totalPages", page.getTotalPages());
        metadata.put("currentPage", page.getNumber());
        metadata.put("pageSize", page.getSize());
        metadata.put("hasNext", page.hasNext());
        metadata.put("hasPrevious", page.hasPrevious());
        return metadata;
    }

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }
    
    public Bug updateBug(Long id, Bug updatedBug) {
        return bugRepository.findById(id)
            .map(bug -> {
                bug.setTitle(updatedBug.getTitle());
                bug.setStatus(updatedBug.getStatus());
                bug.setAssignee(updatedBug.getAssignee());
                bug.setProject(updatedBug.getProject());
                return bugRepository.save(bug);
            })
            .orElseThrow(() -> new RuntimeException("Bug not found with id: " + id));
    }
    
    public void deleteBug(Long id) {
        bugRepository.deleteById(id);
    }
    
    public Bug updateBugStatus(Long id, String status) {
        return bugRepository.findById(id)
            .map(bug -> {
                bug.setStatus(status);
                return bugRepository.save(bug);
            })
            .orElseThrow(() -> new RuntimeException("Bug not found with id: " + id));
    }
    
}

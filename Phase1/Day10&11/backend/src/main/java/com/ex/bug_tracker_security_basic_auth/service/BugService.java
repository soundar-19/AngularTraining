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
import com.ex.bug_tracker_security_basic_auth.entity.Status;
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
        .filter(bug -> status == null || bug.getStatus().name().equalsIgnoreCase(status))
        .filter(bug -> assignee == null || bug.getAssignee().equalsIgnoreCase(assignee))
        .filter(bug -> project == null || bug.getProject().equalsIgnoreCase(project))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority()))
        .toList();
    }

    public List<BugResponseDTO> getByStatus(String status) {
        return bugRepository.findAll().stream()
        .filter(bug-> bug.getStatus().name().equalsIgnoreCase(status))
        .map(bug -> new BugResponseDTO(bug.getId(),bug.getTitle(),bug.getDescription(),bug.getStatus(),bug.getAssignee(),bug.getProject(),bug.getPriority())).toList();
    }

    public BugResponseDTO getBugById(Long id){
        return bugRepository.findById(id)
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority()))
        .orElse(null);
    }   

    public List<BugResponseDTO> getByAssignee(String assignee) {
        return bugRepository.findAll().stream()
        .filter(bug -> bug.getAssignee().equalsIgnoreCase(assignee))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority())).toList();
    }

    public List<BugResponseDTO> getByProject(String project) {
        return bugRepository.findAll().stream()
        .filter(bug -> bug.getProject().equalsIgnoreCase(project))
        .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority())).toList();
    }

    public Page<BugResponseDTO> getAllBugs(Pageable pageable){
        return bugRepository.findAll(pageable).map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority()));
    }
    
    public Page<BugResponseDTO> searchBugs(String status, String assignee, String project, Pageable pageable){
        List<BugResponseDTO> filtered = filterBugs(status, assignee, project);
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<BugResponseDTO> pageContent = start < filtered.size() ? filtered.subList(start, end) : List.of();
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
    
    public Page<BugResponseDTO> searchBugsAdvanced(String status, String priority, String assignee, String project, String search, Pageable pageable){
        List<BugResponseDTO> filtered = bugRepository.findAll().stream()
            .filter(bug -> status == null || status.isEmpty() || bug.getStatus().name().equalsIgnoreCase(status))
            .filter(bug -> priority == null || priority.isEmpty() || bug.getPriority().name().equalsIgnoreCase(priority))
            .filter(bug -> assignee == null || assignee.isEmpty() || bug.getAssignee().toLowerCase().contains(assignee.toLowerCase()))
            .filter(bug -> project == null || project.isEmpty() || bug.getProject().toLowerCase().contains(project.toLowerCase()))
            .filter(bug -> search == null || search.isEmpty() || 
                bug.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                bug.getAssignee().toLowerCase().contains(search.toLowerCase()) ||
                bug.getProject().toLowerCase().contains(search.toLowerCase()))
            .map(bug -> new BugResponseDTO(bug.getId(), bug.getTitle(), bug.getDescription(), bug.getStatus(), bug.getAssignee(), bug.getProject(), bug.getPriority()))
            .sorted((b1, b2) -> {
                if (pageable.getSort().isSorted()) {
                    var sort = pageable.getSort().iterator().next();
                    int result = compareByField(b1, b2, sort.getProperty());
                    return sort.isAscending() ? result : -result;
                }
                return 0;
            })
            .toList();
            
        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<BugResponseDTO> pageContent = start < filtered.size() ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }
    
    private int compareByField(BugResponseDTO b1, BugResponseDTO b2, String field) {
        return switch (field.toLowerCase()) {
            case "id" -> Long.compare(b1.getId(), b2.getId());
            case "title" -> b1.getTitle().compareToIgnoreCase(b2.getTitle());
            case "status" -> b1.getStatus().name().compareToIgnoreCase(b2.getStatus().name());
            case "priority" -> b1.getPriority().name().compareToIgnoreCase(b2.getPriority().name());
            case "assignee" -> b1.getAssignee().compareToIgnoreCase(b2.getAssignee());
            case "project" -> b1.getProject().compareToIgnoreCase(b2.getProject());
            default -> 0;
        };
    }

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }
    
    public Map<String, Object> getBugStatistics() {
        List<Bug> allBugs = bugRepository.findAll();
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", allBugs.size());
        stats.put("open", allBugs.stream().filter(b -> b.getStatus().name().equals("OPEN")).count());
        stats.put("inProgress", allBugs.stream().filter(b -> b.getStatus().name().equals("IN_PROGRESS")).count());
        stats.put("closed", allBugs.stream().filter(b -> b.getStatus().name().equals("CLOSED")).count());
        stats.put("high", allBugs.stream().filter(b -> b.getPriority().name().equals("HIGH")).count());
        stats.put("medium", allBugs.stream().filter(b -> b.getPriority().name().equals("MEDIUM")).count());
        stats.put("low", allBugs.stream().filter(b -> b.getPriority().name().equals("LOW")).count());
        
        return stats;
    }
    
    public Bug updateBug(Long id, Bug updatedBug) {
        return bugRepository.findById(id)
            .map(bug -> {
                if (updatedBug.getTitle() != null) bug.setTitle(updatedBug.getTitle());
                if (updatedBug.getDescription() != null) bug.setDescription(updatedBug.getDescription());
                if (updatedBug.getStatus() != null) bug.setStatus(updatedBug.getStatus());
                if (updatedBug.getAssignee() != null) bug.setAssignee(updatedBug.getAssignee());
                if (updatedBug.getProject() != null) bug.setProject(updatedBug.getProject());
                if (updatedBug.getPriority() != null) bug.setPriority(updatedBug.getPriority());
                return bugRepository.save(bug);
            })
            .orElseThrow(() -> new RuntimeException("Bug not found with id: " + id));
    }
    
    public void deleteBug(Long id) {
        bugRepository.deleteById(id);
    }
    
    public Bug updateBugStatus(Long id, Status status) {
        return bugRepository.findById(id)
            .map(bug -> {
                bug.setStatus(status);
                return bugRepository.save(bug);
            })
            .orElseThrow(() -> new RuntimeException("Bug not found with id: " + id));
    }
    
}

package com.ex.bug_tracker_security_basic_auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BugResponseDTO {
    
    private Long id;
    private String title;
    private String status;
    private String assignee;
    private String project;
    
}

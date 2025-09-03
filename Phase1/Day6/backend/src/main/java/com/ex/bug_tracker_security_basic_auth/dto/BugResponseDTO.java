package com.ex.bug_tracker_security_basic_auth.dto;

import com.ex.bug_tracker_security_basic_auth.entity.Priority;
import com.ex.bug_tracker_security_basic_auth.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BugResponseDTO {
    
    private Long id;
    private String title;
    private Status status;
    private String assignee;
    private String project;
    private Priority priority;
    
}

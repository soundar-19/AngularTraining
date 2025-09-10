package com.ex.bug_tracker_security_basic_auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ex.bug_tracker_security_basic_auth.entity.Bug;

public interface BugRepository extends JpaRepository<Bug, Long>{
    
}

package com.ex.bug_tracker_security_basic_auth.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ex.bug_tracker_security_basic_auth.entity.Bug;
import com.ex.bug_tracker_security_basic_auth.entity.Priority;
import com.ex.bug_tracker_security_basic_auth.entity.Status;
import com.ex.bug_tracker_security_basic_auth.repository.BugRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final BugRepository bugRepository;
    
    public DataInitializer(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (bugRepository.count() == 0) {
            bugRepository.save(new Bug(null, "Login Authentication Failed", Status.OPEN, "John Doe", "Web Application", Priority.HIGH));
            bugRepository.save(new Bug(null, "Submit Button Unresponsive", Status.OPEN, "Jane Smith", "Mobile App", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "Database Connection Timeout", Status.IN_PROGRESS, "Mike Johnson", "Backend API", Priority.HIGH));
            bugRepository.save(new Bug(null, "UI Layout Issues on Mobile", Status.OPEN, "Sarah Wilson", "Web Application", Priority.LOW));
            bugRepository.save(new Bug(null, "Email Notifications Not Working", Status.CLOSED, "Tom Brown", "Notification Service", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "Search Function Returns No Results", Status.IN_PROGRESS, "Lisa Davis", "Web Application", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "File Upload Fails for Large Files", Status.OPEN, "David Miller", "File Service", Priority.HIGH));
            bugRepository.save(new Bug(null, "Password Reset Link Expired", Status.CLOSED, "Emma Garcia", "Authentication", Priority.LOW));
            bugRepository.save(new Bug(null, "Performance Issues During Peak Hours", Status.OPEN, "Alex Rodriguez", "Backend API", Priority.HIGH));
            bugRepository.save(new Bug(null, "Chart Data Not Loading", Status.IN_PROGRESS, "Chris Lee", "Dashboard", Priority.MEDIUM));
        }
    }
}
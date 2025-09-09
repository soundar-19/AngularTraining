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
            bugRepository.save(new Bug(null, "Login Authentication Failed", "Users are unable to authenticate with valid credentials", Status.OPEN, "John Doe", "Web Application", Priority.HIGH));
            bugRepository.save(new Bug(null, "Submit Button Unresponsive", "Form submission button does not respond to clicks", Status.OPEN, "Jane Smith", "Mobile App", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "Database Connection Timeout", "Database queries are timing out after 30 seconds", Status.IN_PROGRESS, "Mike Johnson", "Backend API", Priority.HIGH));
            bugRepository.save(new Bug(null, "UI Layout Issues on Mobile", "Layout breaks on mobile devices below 768px width", Status.OPEN, "Sarah Wilson", "Web Application", Priority.LOW));
            bugRepository.save(new Bug(null, "Email Notifications Not Working", "System is not sending email notifications to users", Status.CLOSED, "Tom Brown", "Notification Service", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "Search Function Returns No Results", "Search functionality returns empty results for valid queries", Status.IN_PROGRESS, "Lisa Davis", "Web Application", Priority.MEDIUM));
            bugRepository.save(new Bug(null, "File Upload Fails for Large Files", "Files larger than 10MB fail to upload with timeout error", Status.OPEN, "David Miller", "File Service", Priority.HIGH));
            bugRepository.save(new Bug(null, "Password Reset Link Expired", "Password reset links expire immediately after generation", Status.CLOSED, "Emma Garcia", "Authentication", Priority.LOW));
            bugRepository.save(new Bug(null, "Performance Issues During Peak Hours", "Application becomes slow and unresponsive during peak usage", Status.OPEN, "Alex Rodriguez", "Backend API", Priority.HIGH));
            bugRepository.save(new Bug(null, "Chart Data Not Loading", "Dashboard charts show loading spinner indefinitely", Status.IN_PROGRESS, "Chris Lee", "Dashboard", Priority.MEDIUM));
        }
    }
}
package com.ex.bug_tracker_security_basic_auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.ex.bug_tracker_security_basic_auth.entity.Bug;
import com.ex.bug_tracker_security_basic_auth.entity.Priority;
import com.ex.bug_tracker_security_basic_auth.entity.Status;
import com.ex.bug_tracker_security_basic_auth.repository.BugRepository;
import java.util.List;

@SpringBootApplication
public class BugTrackerSecurityBasicAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(BugTrackerSecurityBasicAuthApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(BugRepository bugRepository){
		return args -> {
			bugRepository.saveAll(List.of(
				new Bug(null,"Login Authentication Failed", Status.OPEN, "John", "Web Application", Priority.HIGH),
				new Bug(null,"Submit Button Unresponsive", Status.OPEN, "Jane", "Mobile App", Priority.MEDIUM),
				new Bug(null,"Database Connection Timeout", Status.IN_PROGRESS, "Bob", "Backend API", Priority.HIGH),
				new Bug(null,"UI Layout Misalignment", Status.OPEN, "Alice", "Web Application", Priority.LOW),
				new Bug(null,"Memory Leak in Service", Status.IN_PROGRESS, "John", "Backend API", Priority.HIGH),
				new Bug(null,"Form Validation Error", Status.CLOSED, "Jane", "Web Application", Priority.MEDIUM),
				new Bug(null,"API Response Delay", Status.OPEN, "Bob", "Backend API", Priority.MEDIUM),
				new Bug(null,"Mobile App Crash", Status.IN_PROGRESS, "Alice", "Mobile App", Priority.HIGH),
				new Bug(null,"Search Feature Not Working", Status.CLOSED, "John", "Web Application", Priority.LOW),
				new Bug(null,"Email Notification Failed", Status.OPEN, "Jane", "Notification Service", Priority.MEDIUM)
			));
		};
	
	}

}

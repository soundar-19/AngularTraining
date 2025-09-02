package com.ex.bug_tracker_security_basic_auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.ex.bug_tracker_security_basic_auth.entity.Bug;
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
				new Bug(null,"Bug 1", "Open", "John", "Project A"),
				new Bug(null,"Bug 2", "In Progress", "Jane", "Project B"),
				new Bug(null,"Bug 3", "Closed", "Bob", "Project C"),
				new Bug(null,"Bug 4", "Open", "Alice", "Project A"),
				new Bug(null,"Bug 5", "In Progress", "John", "Project B"),
				new Bug(null,"Bug 6", "Closed", "Jane", "Project C"),
				new Bug(null,"Bug 7", "Open", "Bob", "Project A"),
				new Bug(null,"Bug 8", "In Progress", "Alice", "Project B"),
				new Bug(null,"Bug 9", "Closed", "John", "Project C"),
				new Bug(null,"Bug 10", "Open", "Jane", "Project A")
			));
		};
	
	}

}

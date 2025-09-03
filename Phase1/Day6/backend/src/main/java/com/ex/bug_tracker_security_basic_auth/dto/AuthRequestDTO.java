package com.ex.bug_tracker_security_basic_auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDTO {

    @NotBlank(message = "User Name cannot be empty")
    private String userName;
    @NotBlank(message = "Password cannot be empty")
    private String password;

}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  message: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  login(usernameInput: any, passwordInput: any) {
    if (usernameInput.value && passwordInput.value) {
      this.isLoading = true;
      this.message = 'Logging in...';
      
      this.authService.login(usernameInput.value, passwordInput.value).subscribe({
        next: (response) => {
          this.authService.storeToken(response.token);
          this.message = `Welcome, ${usernameInput.value}!`;
          this.isLoading = false;
        },
        error: (error) => {
          this.message = 'Login failed. Please check your credentials.';
          this.isLoading = false;
          console.error('Login error:', error);
        }
      });
    } else {
      this.message = 'Please enter both username and password';
    }
  }
}

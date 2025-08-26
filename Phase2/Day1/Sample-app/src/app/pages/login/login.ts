import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  message: string = '';

  login(usernameInput: any, passwordInput: any) {
    if (usernameInput.value && passwordInput.value) {
      this.message = `Welcome, ${usernameInput.value}!`;
      usernameInput.value = '';
      passwordInput.value = '';
    } else {
      this.message = 'Please enter both username and password';
    }
  }
}

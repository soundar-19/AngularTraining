import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon">🚫</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <button class="btn-primary" (click)="goBack()">Go to Dashboard</button>
      </div>
    </div>
  `,
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
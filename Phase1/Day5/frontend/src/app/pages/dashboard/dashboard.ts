import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BugService } from '../../services/bug.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalBugs = 0;
  openBugs = 0;
  closedBugs = 0;
  highPriorityBugs = 0;
  username = '';

  constructor(private bugService: BugService, private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadBugCounts();
  }

  private loadBugCounts(): void {
    this.bugService.getBugs().subscribe(bugs => {
      this.totalBugs = bugs.length;
      this.openBugs = bugs.filter(bug => bug.status === 'Open').length;
      this.closedBugs = bugs.filter(bug => bug.status === 'Closed').length;
      this.highPriorityBugs = bugs.filter(bug => bug.status === 'Open').length;
    });
  }
}

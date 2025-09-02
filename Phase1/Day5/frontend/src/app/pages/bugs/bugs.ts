import { Component, OnInit } from '@angular/core';
import { BugItemComponent } from './bug-item/bug-item';
import { BugService, Bug } from '../../services/bug.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [BugItemComponent, CommonModule],
  templateUrl: './bugs.html',
  styleUrl: './bugs.css'
})
export class BugComponent implements OnInit {
  bugs: Bug[] = [];
  showAddForm = false;
  message = '';
  
  constructor(private bugService: BugService) {}
  
  ngOnInit() {
    this.loadBugs();
  }
  
  loadBugs() {
    this.bugService.getBugs().subscribe({
      next: (bugs) => {
        this.bugs = bugs;
      },
      error: (error) => {
        console.error('Error loading bugs:', error);
        this.message = 'Error loading bugs';
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
  
  get totalBugs() {
    return this.bugs.length;
  }
  
  get showingBugs() {
    return this.bugs.length;
  }
}

import { Component } from '@angular/core';
import { BugItemComponent } from './bug-item/bug-item';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [BugItemComponent],
  templateUrl: './bugs.html',
  styleUrl: './bugs.css'
})
export class BugComponent {
  totalBugs = 3;
  showingBugs = 3;
  showAddForm = false;
  message = '';
  
  // Track which bugs are visible
  showBug1 = true;
  showBug2 = true;
  showBug3 = true;
  showBug4 = false;
  showBug5 = false;
  
  // Track bug statuses
  bug1Status = 'Open';
  bug2Status = 'Open';
  bug3Status = 'Closed';
  bug4Status = 'Open';
  bug5Status = 'Open';
  
  // Store new bug data
  newBug4 = { title: '', description: '', priority: '' };
  newBug5 = { title: '', description: '', priority: '' };

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addBug(titleInput: any, descInput: any, priorityInput: any) {
    if (titleInput.value && descInput.value && priorityInput.value) {
      if (!this.showBug4) {
        this.newBug4 = {
          title: titleInput.value,
          description: descInput.value,
          priority: priorityInput.value
        };
        this.showBug4 = true;
      } else if (!this.showBug5) {
        this.newBug5 = {
          title: titleInput.value,
          description: descInput.value,
          priority: priorityInput.value
        };
        this.showBug5 = true;
      }
      
      this.message = `New bug created: ${titleInput.value}`;
      titleInput.value = '';
      descInput.value = '';
      priorityInput.value = '';
      this.showAddForm = false;
      this.totalBugs++;
      this.updateShowingCount();
    }
  }
  
  toggleBugStatus(bugNumber: number) {
    if (bugNumber === 1) {
      this.bug1Status = this.bug1Status === 'Open' ? 'Closed' : 'Open';
    }
    if (bugNumber === 2) {
      this.bug2Status = this.bug2Status === 'Open' ? 'Closed' : 'Open';
    }
    if (bugNumber === 3) {
      this.bug3Status = this.bug3Status === 'Open' ? 'Closed' : 'Open';
    }
    if (bugNumber === 4) {
      this.bug4Status = this.bug4Status === 'Open' ? 'Closed' : 'Open';
    }
    if (bugNumber === 5) {
      this.bug5Status = this.bug5Status === 'Open' ? 'Closed' : 'Open';
    }
  }
  
  updateShowingCount() {
    this.showingBugs = 0;
    if (this.showBug1) this.showingBugs++;
    if (this.showBug2) this.showingBugs++;
    if (this.showBug3) this.showingBugs++;
    if (this.showBug4) this.showingBugs++;
    if (this.showBug5) this.showingBugs++;
  }
}

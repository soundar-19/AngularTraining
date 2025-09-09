import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-bug-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bug-item.html',
  styleUrl: './bug-item.css'
})
export class BugItemComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() status: string = '';
  @Input() id: number = 0;
  @Output() toggleStatus = new EventEmitter<number>();
  @Output() deleteBug = new EventEmitter<number>();
  
  role: string | null = null;
  
  constructor(private auth: AuthService) { }
  
  ngOnInit() {
    this.role = this.auth.getUserRole();
    console.log('Bug item role:', this.role); // Debug log
  }
  onToggleStatus() {
    this.toggleStatus.emit(this.id);
  }
  
  onDeleteBug() {
    this.deleteBug.emit(this.id);
  }
  
  getStatusLabel(): string {
    switch(this.status) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'CLOSED': return 'Closed';
      default: return this.status;
    }
  }
  
  getPriorityLabel(): string {
    switch(this.priority) {
      case 'HIGH': return 'High';
      case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
      default: return this.priority;
    }
  }
  
  getActionIcon(): string {
    return this.status === 'OPEN' ? 'pi-check' : 'pi-refresh';
  }
  
  getActionTitle(): string {
    return this.status === 'OPEN' ? 'Mark as completed' : 'Reopen bug';
  }
}
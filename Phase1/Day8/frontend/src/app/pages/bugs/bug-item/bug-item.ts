import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BugDetail } from "../bug-detail/bug-detail";
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-bug-item',
  standalone: true,
  imports: [CommonModule, FormsModule, BugDetail, SelectModule],
  template: `
<div class="bug-card">
  <div class="bug-header">
    <div class="bug-id-section">
      <span class="bug-id">#{{id}}</span>
      <p-select 
        [ngModel]="status" 
        [options]="statusOptions" 
        optionLabel="label" 
        optionValue="value"
        (onChange)="onStatusChange($event)"
        styleClass="status-dropdown"
        placeholder="Status">
      </p-select>
    </div>
    <div class="bug-actions">
      <span class="priority-badge" [ngClass]="'priority-' + priority.toLowerCase()">{{getPriorityLabel()}}</span>
      <button class="action-btn edit-btn" (click)="editBug($event)" title="Edit bug">
        <i class="pi pi-pencil"></i>
      </button>
      <button class="action-btn delete-btn" (click)="onDeleteBug($event)" title="Delete bug" *ngIf="role === 'ADMIN'">
        <i class="pi pi-trash"></i>
      </button>
    </div>
  </div>
  
  <div class="bug-content" (click)="onSelectBug()">
    <h3 class="bug-title">{{title}}</h3>
    <p class="bug-description">{{description}}</p>
    <div class="bug-meta">
      <div class="meta-item" *ngIf="assignee">
        <i class="pi pi-user"></i>
        <span>{{assignee}}</span>
      </div>
      <div class="meta-item" *ngIf="project">
        <i class="pi pi-folder"></i>
        <span>{{project}}</span>
      </div>
    </div>
  </div>
</div>

<!-- Bug Detail Modal (outside of card) -->
<app-bug-detail 
  [isVisible]="showBugDetails"
  [bugId]="id" 
  [title]="title" 
  [description]="description" 
  [priority]="priority" 
  [status]="status" 
  [assignee]="assignee" 
  [project]="project"
  (close)="onCloseBugDetail()">
</app-bug-detail>
  `,
  styleUrl: './bug-item.css'
})
export class BugItemComponent implements OnInit {
  showBugDetails = false;
  
  statusOptions = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' }
  ];
  


  onSelectBug() {
    this.showBugDetails = true;
  }
  
  onCloseBugDetail() {
    this.showBugDetails = false;
  }

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() status: string = '';
  @Input() id: number = 0;
  @Input() assignee: string = '';
  @Input() project: string = '';
  @Output() statusChange = new EventEmitter<{id: number, status: string}>();
  @Output() deleteBug = new EventEmitter<number>();
  @Output() editBugEvent = new EventEmitter<any>();
  @Output() selectedId = new EventEmitter<number>();
  
  role: string | null = null;
  
  constructor(private auth: AuthService) { }
  
  ngOnInit() {
    this.role = this.auth.getUserRole();
    console.log('Bug item role:', this.role); // Debug log
  }
  onStatusChange(event: any) {
    event.originalEvent?.stopPropagation();
    this.statusChange.emit({ id: this.id, status: event.value });
  }
  
  editBug(event: Event) {
    event.stopPropagation();
    const bug = {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      assignee: this.assignee,
      project: this.project
    };
    this.editBugEvent.emit(bug);
  }
  
  onDeleteBug(event: Event) {
    event.stopPropagation();
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
  

}
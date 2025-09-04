import { Component, OnInit } from '@angular/core';

import { BugService, Bug, BugPage, SearchParams, BugStats } from '../../services/bug.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, SelectModule, PaginatorModule, ButtonModule, CardModule, ProgressSpinnerModule, TooltipModule],
  templateUrl: './bugs.html',
  styleUrl: './bugs.css'
})
export class BugComponent implements OnInit {
  bugs: Bug[] = [];
  showAddForm = false;
  message = '';
  loading = false;
  stats: BugStats = { total: 0, open: 0, inProgress: 0, closed: 0, high: 0, medium: 0, low: 0 };
  
  // Pagination
  first = 0;
  rows = 12;
  totalRecords = 0;
  
  // Search and filters
  searchText = '';
  filterStatus: string | null = null;
  filterPriority: string | null = null;
  sortField = 'id';
  sortDirection = 'desc';
  
  private searchSubject = new Subject<string>();
  

  
  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Closed', value: 'CLOSED' }
  ];
  
  priorityOptions = [
    { label: 'All Priority', value: null },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
  ];
  
  sortOptions = [
    { label: 'ID', value: 'id' },
    { label: 'Title', value: 'title' },
    { label: 'Status', value: 'status' },
    { label: 'Priority', value: 'priority' },
    { label: 'Assignee', value: 'assignee' },
    { label: 'Project', value: 'project' }
  ];
  
  pageSizeOptions = [
    { label: '6 per page', value: 6 },
    { label: '12 per page', value: 12 },
    { label: '24 per page', value: 24 },
    { label: '48 per page', value: 48 }
  ];
  
  constructor(private bugService: BugService) {}
  
  ngOnInit() {
    this.loadBugs();
    this.loadStats();
    this.setupSearch();
  }
  
  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.first = 0;
      this.loadBugs();
    });
  }
  
  loadBugs() {
    this.loading = true;
    const params: SearchParams = {
      page: Math.floor(this.first / this.rows) + 1,
      size: this.rows,
      sort: `${this.sortField},${this.sortDirection}`
    };
    
    if (this.searchText) params.search = this.searchText;
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterPriority) params.priority = this.filterPriority;
    
    this.bugService.getBugs(params).subscribe({
      next: (response: BugPage) => {
        this.bugs = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bugs:', error);
        this.message = 'Error loading bugs';
        this.loading = false;
      }
    });
  }
  
  loadStats() {
    this.bugService.getBugStatistics().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  toggleAddForm() {
    if (this.showAddForm) {
      this.resetForm();
    } else {
      this.showAddForm = true;
    }
  }
  
  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }
  
  applyFilters() {
    this.first = 0;
    this.loadBugs();
  }
  
  clearFilters() {
    this.searchText = '';
    this.filterStatus = null;
    this.filterPriority = null;
    this.sortField = 'id';
    this.sortDirection = 'desc';
    this.first = 0;
    this.loadBugs();
    this.loadStats();
  }
  
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadBugs();
  }
  

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.first = 0;
    this.loadBugs();
  }
  
  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'pi-sort-alt';
    }
    return this.sortDirection === 'asc' ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down';
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'OPEN': return 'Open';
      case 'CLOSED': return 'Closed';
      default: return status;
    }
  }
  
  // Form fields
  newBugTitle = '';
  newBugDescription = '';
  newBugPriority: string | null = null;
  newBugProject = '';
  newBugAssignee = '';
  editingBug: Bug | null = null;

  createBug() {
    if (!this.newBugTitle.trim()) {
      this.message = 'Please enter a bug title';
      return;
    }
    
    if (!this.newBugDescription.trim()) {
      this.message = 'Please enter a bug description';
      return;
    }
    
    if (!this.newBugPriority) {
      this.message = 'Please select a priority';
      return;
    }
    
    if (!this.newBugProject.trim()) {
      this.message = 'Please enter a project name';
      return;
    }
    
    if (!this.newBugAssignee.trim()) {
      this.message = 'Please enter an assignee';
      return;
    }
    
    this.loading = true;
    const bugData = {
      title: this.newBugTitle,
      description: this.newBugDescription,
      status: this.editingBug ? this.editingBug.status : 'OPEN' as const,
      assignee: this.newBugAssignee,
      project: this.newBugProject,
      priority: (this.newBugPriority as 'HIGH' | 'MEDIUM' | 'LOW')
    };
    
    const operation = this.editingBug 
      ? this.bugService.updateBug(this.editingBug.id, bugData)
      : this.bugService.createBug(bugData);
    
    operation.subscribe({
      next: () => {
        this.message = this.editingBug ? 'Bug updated successfully!' : 'Bug created successfully!';
        this.resetForm();
        this.loadBugs();
        this.loadStats();
        this.loading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error saving bug:', error);
        this.message = 'Error saving bug. Please try again.';
        this.loading = false;
      }
    });
  }
  
  resetForm() {
    this.newBugTitle = '';
    this.newBugDescription = '';
    this.newBugPriority = null;
    this.newBugProject = '';
    this.newBugAssignee = '';
    this.editingBug = null;
    this.showAddForm = false;
  }
  
  quickFilter(type: 'status' | 'priority', value: string) {
    if (type === 'status') {
      this.filterStatus = this.filterStatus === value ? null : value;
    } else {
      this.filterPriority = this.filterPriority === value ? null : value;
    }
    this.first = 0;
    this.loadBugs();
  }
  
  quickStatFilter(status: string) {
    this.filterStatus = this.filterStatus === status ? null : status;
    this.first = 0;
    this.loadBugs();
  }
  
  closeModalOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.toggleAddForm();
    }
  }
  
  trackByBugId(index: number, bug: Bug): number {
    return bug.id;
  }
  
  onSortChange() {
    this.first = 0;
    this.loadBugs();
  }
  
  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.first = 0;
    this.loadBugs();
  }
  
  onPageSizeChange() {
    this.first = 0;
    this.loadBugs();
  }
  
  previousPage() {
    if (this.first > 0) {
      this.first = Math.max(0, this.first - this.rows);
      this.loadBugs();
    }
  }
  
  nextPage() {
    if (this.first + this.rows < this.totalRecords) {
      this.first += this.rows;
      this.loadBugs();
    }
  }
  
  isLastPage(): boolean {
    return this.first + this.rows >= this.totalRecords;
  }
  
  getCurrentPageInfo(): string {
    const currentPage = Math.floor(this.first / this.rows) + 1;
    const totalPages = Math.ceil(this.totalRecords / this.rows);
    return `${currentPage} / ${totalPages}`;
  }
  
  getResultsText(): string {
    const start = this.first + 1;
    const end = Math.min(this.first + this.rows, this.totalRecords);
    return `Showing ${start}-${end} of ${this.totalRecords} bugs`;
  }
  
  onBugStatusToggle(bugId: number) {
    const bug = this.bugs.find(b => b.id === bugId);
    if (!bug) return;
    
    const newStatus = bug.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const oldStatus = bug.status;
    
    // Update UI immediately (optimistic update)
    bug.status = newStatus as any;
    
    this.loading = true;
    this.bugService.updateBugStatus(bugId, newStatus).subscribe({
      next: () => {
        this.message = `Bug ${newStatus === 'CLOSED' ? 'closed' : 'reopened'} successfully!`;
        this.loadStats();
        this.loading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating bug status:', error);
        // Revert status on error
        bug.status = oldStatus;
        this.message = 'Error updating bug status';
        this.loading = false;
      }
    });
  }
  
  editBug(bug: Bug) {
    this.editingBug = bug;
    this.newBugTitle = bug.title;
    this.newBugDescription = bug.description || '';
    this.newBugPriority = bug.priority;
    this.newBugProject = bug.project;
    this.newBugAssignee = bug.assignee;
    this.showAddForm = true;
  }

  deleteBug(bugId: number) {
    if (!confirm('Are you sure you want to delete this bug?')) return;
    
    console.log('Deleting bug:', bugId);
    
    // Remove immediately from UI (optimistic update)
    this.bugs = this.bugs.filter(bug => bug.id !== bugId);
    this.totalRecords--;
    
    this.loading = true;
    this.bugService.deleteBug(bugId).subscribe({
      next: () => {
        console.log('Bug deleted successfully');
        this.message = 'Bug deleted successfully!';
        this.loadStats();
        this.loading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting bug:', error);
        this.message = 'Error deleting bug';
        // Reload bugs on error to restore the item
        this.loadBugs();
        this.loading = false;
      }
    });
  }
}

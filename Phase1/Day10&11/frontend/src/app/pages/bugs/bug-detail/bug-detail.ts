import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

@Component({
  selector: 'app-bug-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bug-detail.html',
  styleUrl: './bug-detail.css'
})
export class BugDetail implements OnInit {
  @Input() bugId: number = 0;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() status: string = '';
  @Input() assignee: string = '';
  @Input() project: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  
  comments: Comment[] = [];
  newComment: string = '';
  currentUser: string = 'Current User';
  
  ngOnInit() {
    this.loadComments();
  }
  
  loadComments() {
    const storageKey = `bug-${this.bugId}-comments`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      this.comments = JSON.parse(stored).map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp)
      }));
    }
  }
  
  saveComments() {
    const storageKey = `bug-${this.bugId}-comments`;
    localStorage.setItem(storageKey, JSON.stringify(this.comments));
  }
  
  addComment() {
    if (!this.newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: this.newComment.trim(),
      author: this.currentUser,
      timestamp: new Date()
    };
    
    this.comments.unshift(comment);
    this.saveComments();
    this.newComment = '';
  }
  
  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.comments = this.comments.filter(c => c.id !== commentId);
      this.saveComments();
    }
  }
  
  closeModal() {
    this.close.emit();
  }
  
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
  
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
}

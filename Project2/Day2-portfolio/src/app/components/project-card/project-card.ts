import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Project {
  title: string;
  description: string;
  image?: string;
  techStack: string[];
  features?: string[];
  liveDemo?: string;
  github?: string;
  isFeatured?: boolean;
  badge?: string;
  backgroundColor?: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() cardClick = new EventEmitter<Project>();

  onCardClick() {
    this.cardClick.emit(this.project);
  }
}
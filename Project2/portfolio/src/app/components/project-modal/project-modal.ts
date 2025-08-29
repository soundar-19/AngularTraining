import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { Project } from '../project-card/project-card';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.css'
})
export class ProjectModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  selectedProject: Project | null = null;
  showContent = false;
  private subscriptions = new Subscription();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.modalService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.showContent = false;
          setTimeout(() => this.showContent = true, 500);
        }
      })
    );
    this.subscriptions.add(
      this.modalService.selectedProject$.subscribe(project => this.selectedProject = project)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  triggerSlideUp() {
    if (!this.showContent) {
      this.showContent = true;
    }
  }

  closeModal() {
    this.showContent = false;
    this.modalService.closeModal();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
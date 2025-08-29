import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../components/project-card/project-card';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(null);

  isOpen$ = this.isOpenSubject.asObservable();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  openModal(project: Project) {
    this.selectedProjectSubject.next(project);
    this.isOpenSubject.next(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isOpenSubject.next(false);
    this.selectedProjectSubject.next(null);
    document.body.style.overflow = 'auto';
  }
}
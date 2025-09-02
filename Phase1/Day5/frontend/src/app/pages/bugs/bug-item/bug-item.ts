import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bug-item',
  standalone: true,
  imports: [],
  templateUrl: './bug-item.html',
  styleUrl: './bug-item.css'
})
export class BugItemComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() status: string = '';
  @Input() id: number = 0;
  @Output() toggleStatus = new EventEmitter<number>();
  
  onToggleStatus() {
    this.toggleStatus.emit(this.id);
  }
}
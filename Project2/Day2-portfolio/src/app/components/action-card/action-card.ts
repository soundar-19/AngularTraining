import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-card.html',
  styleUrl: './action-card.css'
})
export class ActionCardComponent {
  @Input() action!: ActionCard;
}
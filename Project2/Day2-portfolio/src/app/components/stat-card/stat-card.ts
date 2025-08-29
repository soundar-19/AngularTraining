import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface StatCard {
  icon: string;
  title: string;
  subtitle: string;
  iconType?: 'emoji' | 'svg';
  url?: string;
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css'
})
export class StatCardComponent {
  @Input() stat!: StatCard;
  @Input() isAchievement = false;

  constructor(private sanitizer: DomSanitizer) {}

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onCardClick() {
    if (this.stat.url) {
      window.open(this.stat.url, '_blank');
    }
  }
}
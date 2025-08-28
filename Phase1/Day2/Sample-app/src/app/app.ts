import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,ButtonModule,DrawerModule,MenubarModule,CardModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('Sample-app');
  sidebarVisible=false;
  appName="sample-app";
  menuItems=[
    {label:'Dashboard',icon:'pi pi-home',routerLink:'/dashboard'}
    ,{label:'Login',icon:'pi pi-user',routerLink:'/login'}
    ,{label:'Bugs',icon:'fas fa-bug',routerLink:'/bugs'}
  ];
}

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Project } from './pages/project/project';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'project', component: Project },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];

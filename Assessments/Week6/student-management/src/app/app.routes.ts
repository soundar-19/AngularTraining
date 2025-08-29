import { Routes } from '@angular/router';
import { StudentRegistrationComponent } from './components/student-registration/student-registration';
import { StudentListComponent } from './components/student-list/student-list';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: StudentRegistrationComponent },
  { path: 'students', component: StudentListComponent },
  { path: '**', redirectTo: '/register' }
];
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { BugComponent } from './pages/bugs/bugs';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent,title:'Dashboard'},
    {path:'login',component:LoginComponent,title:'Login'},
    {path:'bugs',component:BugComponent,title:'Bugs'},
    {path:'**',redirectTo:'login',pathMatch:'full'}
];

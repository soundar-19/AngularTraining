import { RoleGuard } from './guards/role.guard';
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { BugComponent } from './pages/bugs/bugs';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent,title:'Dashboard',canActivate:[AuthGuard]},
    {path:'login',component:LoginComponent,title:'Login'},
    {path:'bugs',component:BugComponent,title:'Bugs',canActivate:[AuthGuard,RoleGuard(['ADMIN','DEVELOPER'])]},
    {path:'unauthorized',component:UnauthorizedComponent,title:'Unauthorized'},
    {path:'**',redirectTo:'dashboard',pathMatch:'full'}
];

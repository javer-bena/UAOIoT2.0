import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AdminComponent } from './components/admin.component';
import { DashboardComponent } from './components/dashboard.component';
import { ProjectComponent } from './components/project.component';
import { ErrorComponent } from './components/error.component';
import { LibrariesComponent } from './components/libraries.component';

const appRoutes: Routes = [
    //{path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'project', component: ProjectComponent},
    {path: 'libraries', component: LibrariesComponent },
    {path: 'error', component: ErrorComponent}
];

export const appRoutingProvider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
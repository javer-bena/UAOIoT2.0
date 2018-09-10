import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AdminComponent } from './components/admin.component';
import { DashboardComponent } from './components/dashboard.component';
import { ErrorComponent } from './components/error.component';
import { LibrariesComponent } from './components/libraries.component';
import { HomeComponent } from './components/home.component';
import { ProfileComponent } from './components/profile.component';

import { TutorialsComponent } from './components/tutorials.component';
import { DevicesComponent } from './components/devices.component';
import { AuthGuardService } from './services/authGuard.service';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'devices', component: DevicesComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
    {path: 'home', component: HomeComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'tutorials', component: TutorialsComponent},
    {path: 'libraries', component: LibrariesComponent },
    {path: 'error', component: ErrorComponent}
];

export const appRoutingProvider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
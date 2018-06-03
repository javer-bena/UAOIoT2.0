import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProvider } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { AdminComponent } from './components/admin.component';
import { DashboardComponent } from './components/dashboard.component';
import { ErrorComponent } from './components/error.component';
import { LibrariesComponent } from './components/libraries.component';
import { ChartComponent } from './components/chart.component'
import { HomeComponent } from './components/home.component';
import { ProfileComponent } from './components/profile.component';

import { TutorialsComponent } from './components/tutorials.component';
import { DevicesComponent } from './components/devices.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    ErrorComponent,
    LibrariesComponent,
    ChartComponent,
    DevicesComponent,
    TutorialsComponent
    
  ],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule

  ],
  providers: [appRoutingProvider],
  bootstrap: [AppComponent],
  entryComponents: [ChartComponent]
})
export class AppModule { }

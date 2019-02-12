import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import { AuthService } from './services/auth.service';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar.component';
import { materialize } from 'rxjs/operators';
import { RegisterComponent } from './components/register.component';
import { ValidateService } from './services/validate.service';
import { PermissionService } from './services/permission.service';

//primeng
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {GrowlModule} from 'primeng/growl';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import {RadioButtonModule} from 'primeng/radiobutton';
import {StepsModule} from 'primeng/steps';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ColorPickerModule} from 'primeng/colorpicker';


import { AuthGuardService } from './services/authGuard.service';
import { ProjectComponent } from './components/project.component';
import { UserListComponent } from './components/userList.component';
import { SubNavbar } from './components/subNavbar.component';
import { SocketService } from './services/socket.service';
import { UserLoginService } from './services/userLogin.service';
import { ProjectService } from './services/project.service';
import { DeviceService } from './services/device.service';
import { DashboardService } from './services/dashboard.service';
import { ChartService } from './services/chart.service';
import { TokenService } from './services/token.service';



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
    TutorialsComponent,
    NavbarComponent,
    RegisterComponent,
    ProjectComponent,
    UserListComponent,
    SubNavbar
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    HttpClientModule,
    HttpModule,
    FormsModule,
    MenubarModule,
    MenuModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    GrowlModule,
    MessageModule,
    MessagesModule,
    TableModule,
    TooltipModule,
    CheckboxModule,
    DialogModule,
    AutoCompleteModule,
    ChipsModule,
    RadioButtonModule,
    StepsModule,
    ToggleButtonModule,
    ColorPickerModule

  ],
  providers: [appRoutingProvider,AuthService, ValidateService, AuthGuardService,
    SocketService,PermissionService,UserLoginService,ProjectService,DeviceService,DashboardService,DeviceService,ChartService,TokenService],
  bootstrap: [AppComponent],
  entryComponents: [ChartComponent],
  
})
export class AppModule { }

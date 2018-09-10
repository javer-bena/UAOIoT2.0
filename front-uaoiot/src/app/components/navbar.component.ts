import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'nav-bar',
    templateUrl: '../views/navbar.component.html',
    styleUrls: ['../styles/navbar.component.scss'],
})

export class NavbarComponent{

    constructor(
        private authService: AuthService,
        private router: Router
    ){
        console.log("Logged in: " + this.authService.loggedIn());
        console.log("get token: " + this.authService.getToken());
        console.log("User details: " + this.authService.getUserDetails());
        console.log("admin loggedin: "+ this.authService.isAdminLoggedIn());

    }

    ngOnInit(){
        
    }

    onLogout(){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
    }
}
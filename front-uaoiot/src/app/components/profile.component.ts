import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'profile',
    templateUrl: '../views/profile.component.html',
    styleUrls: ['../styles/profile.component.scss']
})

export class ProfileComponent{

    user:Object;

    constructor(
        private authService:AuthService,
        private router:Router
    ){}

    ngOnInit(){
        this.authService.getProfile().subscribe(profile => {
            this.user = profile.user;
        },
        err => {
            console.log(err);
            return false;
        });
    }

    logout(){
        this.authService.logout();
    }
}
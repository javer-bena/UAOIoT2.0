import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../services/userLogin.service';
import { UserLogin } from '../models/userLogin';
import {MenuItem} from 'primeng/api';
import { TokenService } from '../services/token.service';


@Component({
    selector: 'nav-bar',
    templateUrl: '../views/navbar.component.html',
    styleUrls: ['../styles/navbar.component.scss'],
})

export class NavbarComponent{

    public display:boolean = false;
    public displayLogout:boolean = false;
    public isLogged:boolean;
    public userNameFromLogin:String;
    public stringUserName:String;
    public tokenString:String;
    public userLogged:UserLogin;
    public itemsProfile: MenuItem[];

    constructor(
        private authService: AuthService,
        private userLoginService: UserLoginService,
        private tokenService: TokenService,
        private router: Router
    ){}

    ngOnInit(){

        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userNameFromLogin = userProfile.user;
            this.stringUserName = userProfile.name;    
        }else{
            this.stringUserName = 'perfil';
        }

        this.itemsProfile = [
                {label: "Credenciales", command: (onclick)=>{this.showCredentials()}},
                {label: "Cerrar sesión", command: (onclick)=>(this.displayLogout = true)}];
        
    }

    showCredentials(){
        this.getInfo();
        this.display = true;

    }
    getInfo(){
        this.tokenService.getTokenByUser(this.userNameFromLogin).subscribe(data =>{
            var token = data.token[0];
            this.tokenString = token.value;
        },Error=>{

        });
    }
    
    copyToClipboard(element) {
        alert(element.value);
        
    }

    getUserName(){

        if(localStorage.getItem('user') != null){

            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.stringUserName = userProfile.name;    
        }else{
            this.stringUserName = 'perfil';
        }

        return this.stringUserName;

    }

    
    logout(){
        this.displayLogout = false;
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
    }
}
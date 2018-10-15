import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserLoginService } from '../services/userLogin.service';
import { UserLogin } from '../models/userLogin';


@Component({
    selector: 'nav-bar',
    templateUrl: '../views/navbar.component.html',
    styleUrls: ['../styles/navbar.component.scss'],
})

export class NavbarComponent{

    public isLogged:boolean;
    public userNameFromLogin:String;
    public stringUserName:String;
    public userLogged:UserLogin;

    constructor(
        private authService: AuthService,
        private userLoginService: UserLoginService,
        private router: Router
    ){}

    ngOnInit(){

        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.stringUserName = userProfile.name;    
        }else{
            this.stringUserName = 'perfil';
        }

        
    }

    getInfo(){

        var userProfile = JSON.parse(localStorage.getItem('user'));
        //this.stringUserName = userProfile.name;   
        
        this.userLoginService.getUserByUserName(userProfile.user).subscribe(data =>{
            var msj = data.message;
            
        },error =>{
            var errorMsj = <any>error;
            console.log('Error en la busqueda' + errorMsj);
        });

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

    onLogout(){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
    }
}
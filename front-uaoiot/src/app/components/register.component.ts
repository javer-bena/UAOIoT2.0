import { Component } from '@angular/core';
import { ValidateService } from '../services/validate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from  '../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../models/userLogin';
import { UserService } from '../services/user.service';

@Component({
    selector: 'register',
    templateUrl: '../views/register.component.html',
    styleUrls: ['../styles/register.component.scss']
})

export class  RegisterComponent{

    userName:String;
    name:String;
    password:String;
    //user:UserLogin;

    constructor(
        private validateService: ValidateService,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ){
        
    }

    ngOnInit(){
        this.authService.getProfile().subscribe(data => {
            console.log(data.user);
        });
    }

    onRegisterSubmit(){
        //this.user = new UserLogin(this.userName,this.name,this.password);
        const userLogin = {
            user: this.userName,
            name: this.name,
            password: this.password
        }
        
        const user = {
            login: this.userName,
            password: this.password,
            name: this.name
        }

        if(!this.validateService.validateEmail(user.login)){
            alert("Ingrese un usuario valido");
            
            return false;
        }

        this.userService.postUser(user).subscribe(data =>{
            alert("Usuario registrado hash:  " + user.password);
        },Error => {
            alert("Algo salio mal");
        });

        this.authService.registerUser(userLogin).subscribe(data => {
            console.log("ENTRA LOGIN USER");
        },Error => {
            console.log("ERROR USER LOGIN");
        });
    }
    
}
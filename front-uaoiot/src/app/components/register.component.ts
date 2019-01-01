import { Component } from '@angular/core';
import { ValidateService } from '../services/validate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from  '../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../models/userLogin';
import { UserService } from '../services/user.service';
import { PermissionService } from '../services/permission.service';
import { UserLoginService } from '../services/userLogin.service';

@Component({
    selector: 'register',
    templateUrl: '../views/register.component.html',
    styleUrls: ['../styles/register.component.scss']
})

export class  RegisterComponent{

    userName:String;
    name:String;
    password:String;
    permission:String;
    readPermission:boolean;
    writePermission:boolean;
    //user:UserLogin;

    constructor(
        private validateService: ValidateService,
        private authService: AuthService,
        private userService: UserService,
        private permissionServie: PermissionService,
        private userLoginService: UserLoginService,
        private router: Router
    ){
        
    }

    ngOnInit(){
        this.readPermission = false;
        this.writePermission = false;
        this.authService.getProfile().subscribe(data => {
            console.log(data.user);
        });
    }

    onRegisterSubmit(){
        //this.user = new UserLogin(this.userName,this.name,this.password);

        if(this.readPermission && this.writePermission){
            this.permission = 'READWRITE';
        }else if(this.readPermission){
            this.permission = 'READ';
        }else if(this.writePermission){
            this.permission = 'WRITE';
        }


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

        const permission = {
            user: user.login,
            topic: 'test1',
            permission: this.permission
        }

        if(!this.validateService.validateEmail(user.login)){
            alert("Ingrese un usuario valido");
            return false;
        }

        this.userLoginService.postUser(userLogin).subscribe(data =>{

        },Error =>{
            console.log("ERROR USER LOGIN");
        })

        this.userService.postUser(user).subscribe(data =>{

            //alert("Usuario registrado hash:  " + user.password);
            alert(data.message);

        },Error => {
            alert("Algo salio mal");
        });

        

        /*this.authService.registerUser(userLogin).subscribe(data => {
            console.log("ENTRA LOGIN USER");
        },Error => {
            console.log("ERROR USER LOGIN");
        });*/

        this.permissionServie.postPermission(permission).subscribe(data => {
            // alert("PASSWORD: " + user.password +"LOGIN:  " +userLogin.password);

        },Error => {
            alert("ERROR :" +Error +" " + "PERMISOS: " + permission.permission +" " + permission.user +" " + permission.topic);
        });
    }
    
}
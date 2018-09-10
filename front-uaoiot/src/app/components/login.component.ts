import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {SelectItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
    selector: 'login',
    templateUrl: '../views/login.component.html',
    styleUrls: ['../styles/login.component.scss'],
    providers: [MessageService]
})

export class LoginComponent{

    public userName:String;
    public userPassword:String;
    public msgs: Message[] = [];

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ){}

    ngOnInit(){
        
    }

    onLoginSubmit(){
        const user = {
            user: this.userName,
            password: this.userPassword
        }

        this.authService.authenticateUser(user).subscribe(data => {
            if(data.success){
                this.authService.storeUserData(data.token, data.login);
                
                if(this.authService.isAdminLoggedIn()){
                    this.router.navigate(['admin']);
                }else{
                    this.router.navigate(['profile']);
                }

            }else{
                this.showError()
                this.router.navigate(['']);
            }
        })
    }

    showError() {
        this.msgs = [];
        this.msgs.push({severity:'warn', summary:'Datos incorrectos', detail:'Validación fallida'});
    }
}
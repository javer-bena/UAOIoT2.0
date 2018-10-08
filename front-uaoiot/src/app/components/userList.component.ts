import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { UserLoginService } from '../services/userLogin.service';
import { UserLogin } from '../models/userLogin';

@Component({
    selector: 'userList',
    templateUrl: '../views/userList.component.html',
    styleUrls: ['../styles/userList.component.scss']
})

export class UserListComponent{
    
    users: UserLogin[];
    cols: any[];
    user: UserLogin;

    constructor(private _userService:UserLoginService){

        this.users = [];
    }

    ngOnInit(){

        this.cols = [
            { field: 'userName', header: 'Usuario' },
            { field: 'name', header: 'Nombre' },
            { field: 'password', header: 'Credencial'}
        ];

        this._userService.getUsers().subscribe(
            result => {
                
                for (var i = 0; i<result.users.length; i++){
                    var userItem = result.users[i];
                    this.user = new UserLogin(userItem.user,userItem.name,userItem.password);
                    this.users.push(this.user);
                    
                }
                
                if(!this.users){
                    console.log("No hay usuarios");
                }
                
            },
            error => {
                var errorMsj = <any>error;
                console.log('Error en la busqueda' + errorMsj);
            }
        );
    }
}
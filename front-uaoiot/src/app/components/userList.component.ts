import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    selector: 'userList',
    templateUrl: '../views/userList.component.html',
    styleUrls: ['../styles/userList.component.scss']
})

export class UserListComponent{
    
    users: User[];
    cols: any[];
    user: User;

    constructor(private _userService:UserService){

        this.users = [];
    }

    ngOnInit(){

        this.cols = [
            { field: 'login', header: 'Usuario' },
            { field: 'password', header: 'SHA256' }
        ];

        this._userService.getUsers().subscribe(
            result => {
                
                for (var i = 0; i<result.users.length; i++){
                    var userItem = result.users[i];
                    this.user = new User(userItem._id,userItem.login,userItem.password);
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
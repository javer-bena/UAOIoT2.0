import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
    selector: 'admin',
    templateUrl: '../views/admin.component.html',
    styleUrls: ['../styles/admin.component.scss'],
    providers: [UserService]
})

export class  AdminComponent{

    constructor(private _userService:UserService){

    }

    ngOnInit(){
        this._userService.getUsers().subscribe(
            result => {
                console.log(result);
            },
            error => {
                var errorMsj = <any>error;
                console.log('Error en la busqueda' + errorMsj);
            }
        );
    }
}
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService} from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'admin',
    templateUrl: '../views/admin.component.html',
    styleUrls: ['../styles/admin.component.scss'],
    providers: [UserService]
})

export class  AdminComponent{
    public users:Array<String>;
    
    /*credentials: TokenPayload = {
        user: '',
        password: '',
        name: ''
    };*/

    constructor(private _userService:UserService, 
        private auth: AuthService, private router: Router){

    }

    ngOnInit(){}
    
}
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class UserService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }

    getPrueba(){
        return 'Funciona el servicio';
    } 

    getUsers(){
        return this._http.get(this.url + 'api/users').map(res => res.json());
    }

    postUser(user){
        let json = JSON.stringify(user);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        console.log("USER POST " + json);
        return this._http.post(this.url + 'api/user', json, {headers: headers})
        .map(res => res.json());
    }
}
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
//import { map, filter } from 'rxjs/operators';

@Injectable()


//TOPICO ES EL PROYECTO
export class PermissionService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }

    getPermission(){
        return this._http.get(this.url + 'api/aclss').map(res => res.json());
    }

    postPermission(permission){
        let json = JSON.stringify(permission);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        console.log("USER POST " + json);
        return this._http.post(this.url + 'api/acls', json, {headers: headers})
        .map(res => res.json());
    }
}
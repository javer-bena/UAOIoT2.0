import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class ProjectService{
    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }


    getProjectByUserName(userName){
        return this._http.get(this.url + 'api/projectUser/' + userName).map(res => res.json());
    }

    postUser(project){
        let json = JSON.stringify(project);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        console.log("PROJECT POST " + json);
        return this._http.post(this.url + 'api/user', json, {headers: headers})
        .map(res => res.json());
    }
}
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

    getProjects(){
        return this._http.get(this.url + 'api/projects').map(res => res.json());
    }

    getProjectByUserName(userName){
        return this._http.get(this.url + 'api/projectUser/' + userName).map(res => res.json());
    }

    postProject(project){
        let json = JSON.stringify(project);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        console.log("PROJECT POST " + json);
        return this._http.post(this.url + 'api/project', json, {headers: headers})
        .map(res => res.json());
    }
}
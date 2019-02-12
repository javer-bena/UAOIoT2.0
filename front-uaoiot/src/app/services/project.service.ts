import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
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

    getProjectByName(name){
        return this._http.get(this.url + 'api/projectName/' + name).map(res => res.json());
    }

    getProjectByUserName(userName){
        return this._http.get(this.url + 'api/projectUser/' + userName).map(res => res.json());
    }

    getProjectById(idProject){
        return this._http.get(this.url + 'api/projectId/' + idProject).map(res => res.json());
    }

    postProject(project){
        let json = JSON.stringify(project);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        
        return this._http.post(this.url + 'api/project', json, {headers: headers})
        .map(res => res.json());
    }

    updateProject(project, idProject){
        let json = JSON.stringify(project);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        
        return this._http.put(this.url + 'api/project/' + idProject, json, {headers: headers}).map(res => res.json());
    }

    deleteProject(idProject){
        return this._http.delete(this.url + 'api/project/' + idProject).map(res => res.json());
    }

    deleteProjectByUser(user){
        return this._http.delete(this.url + 'api/project' + user).map(res => res.json());
    }
}
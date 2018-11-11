import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class ChartService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }

    getChartByProject(projectId){
        return this._http.get(this.url + 'api/chartproject/' + projectId).map(res => res.json());
    }
}
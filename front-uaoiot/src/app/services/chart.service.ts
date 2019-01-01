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

    postChart(chart){
        let json = JSON.stringify(chart);
        let headers = new Headers();

        headers.append('Content-Type','application/json');

        return this._http.post(this.url + 'api/chart',json,{headers:headers})
        .map(res => res.json());
    }

    deleteChartsByProject(project){

        return this._http.delete(this.url + 'api/chart/' + project).map(res => res.json());
    }

    deleteChartsById(chartId){
        return this._http.delete(this.url + 'api/chartById/' + chartId).map(res => res.json());
    }
}
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class MessageService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/api/messages";
    }

    getPrueba(){
        return 'Funciona el servicio';
    } 

    getMessages(){
        return this._http.get(this.url)
            .map(res => res.json());

    }

    
}
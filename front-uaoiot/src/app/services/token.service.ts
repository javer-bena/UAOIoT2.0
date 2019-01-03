import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class TokenService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }

    getTokenByUser(userName){
        return this._http.get(this.url + 'api/tokenuser/' + userName).map(res => res.json());

    }
}
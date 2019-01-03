import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';
//import { map, filter } from 'rxjs/operators';

@Injectable()

export class DeviceService{

    public url:string;

    constructor(private _http:Http){
        this.url = "http://localhost:3000/";
    }


    getDeviceByUserName(userName){
        return this._http.get(this.url + 'api/deviceuser/' + userName).map(res => res.json());
    }

    getDeviceByProject(project){
        return this._http.get(this.url + 'api/deviceproject/' + project).map(res => res.json());
    }

    postDevice(device){
        let json = JSON.stringify(device);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        return this._http.post(this.url + 'api/device', json, {headers: headers})
        .map(res => res.json());
    }

    deleteDevice(idDevice){
        return this._http.delete(this.url + 'api/device/' + idDevice).map(res => res.json());
    }

    deleteDevicetByProject(project){
        return this._http.delete(this.url + 'api/device' + project).map(res => res.json());
    }
}
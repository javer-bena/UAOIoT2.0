import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { HttpModule } from '@angular/http';

import { map } from 'rxjs/operators';
import {Observable} from 'rxjs/Rx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()

export class AuthService{
    authToken: any;
    token:String;
    user: any;
    url:String;

    constructor(private http: Http, private router:Router){
        //this.isDev = true;
        this.url = 'http://localhost:3000/';
    }

    registerUser(user){
        let json = JSON.stringify(user);
        let headers = new Headers();
        
        headers.append('Content-Type','application/json');
        console.log("USER POST " + json);
        return this.http.post(this.url + 'api/register', json, {headers: headers})
        .map(res => res.json());
    }

    authenticateUser(user){
        let json = JSON.stringify(user);

        let headers = new Headers();
        headers.append('Content-Type','application/json');

        return this.http.post(this.url + 'api/auth', user, {headers: headers})
        .map(res => res.json());
    }

    getProfile() {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.get('userlogins/profile', {headers: headers})
        .map(res => res.json());
    }
    
    storeUserData(token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }
    
    loadToken() {
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    getToken(){
        if(!this.token){
            this.token = localStorage.getItem('id_token');
        }

        return this.token;
    }

    getUserDetails(){
        const token = this.getToken();
        let payload;

        if(token){
            payload = token.split('.')[1];
            payload = window.atob(payload);

            console.log(JSON.parse(payload))
            return JSON.parse(payload);
        }else{
            return null;
        }
    }

    isAdminLoggedIn(){
        const user = this.getUserDetails();

        if(this.loggedIn()){
            if(user.data.user === "admin"){
                return true;
            }
        }else{
            return false;
        }
    }
    
    loggedIn() {
        const user = this.getUserDetails();

        if(user && localStorage.getItem('id_token')){

            return user.exp > Date.now() / 1000;
        }else{
            return false;
        }
        //return tokenNotExpired('id_token');
    }
    
    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
        this.router.navigate(['']);
    }
}

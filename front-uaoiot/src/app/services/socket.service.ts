import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()

export class SocketService{

    private socket;

    constructor(){
        this.socket = io('http://localhost:5000');
    }

    onNewMessageListen() {
        this.socket.on('reciveMessage',function(data){
            console.log('MSG DATA SOCKET '+ data.payload)
            alert(data.payload);
        })
    }

    // EMITTER
    sendMessage(msg: string) {
        
        this.socket.emit('sendMessage', { payload: msg, topic: 'test1' });
    }

    // HANDLER
    onNewMessage() {
        return Observable.create(observer => {
            this.socket.on('reciveMessage', msg => {
                
                observer.next(msg);
            });
        });
    }

}
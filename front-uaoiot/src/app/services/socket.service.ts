import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Observable } from 'rxjs/Rx';
import * as io from 'socket.io-client';

@Injectable()

export class SocketService{

    private socket;

    private listMessage = [];

    constructor(){
        //this.socket = io('http://localhost:5000');
        this.listMessage = [];
    }

    initSocket(){
        this.socket = io('http://localhost:5000');

    }

    
    onNewMessageListen(){

        var list = [];
        this.socket.on('reciveMessage',function(data){
            console.log('MSG DATA SOCKET '+ data.payload);
    
            list.push(data.payload);
            
            
            console.log('ARRAY DATA SOCKET '+ list);     
            //alert(data.payload);
        })

    }

    // HANDLER
    onNewMessage():Observable<Message> {
        return Observable.create(observer => {
            
            this.socket.on('reciveMessage', msg => {
                console.log("MSG OBSERVER SOCKET: " + msg);
                observer.next(msg);
            });
        });
    }

    //
    sendDataMqtt(userName:String,topic:String,password:String){

        this.socket.emit('sendData',{user: userName, topic: topic, password: password});
    }

    sendDisconnect(){
        this.socket.emit('disconnect',{payload:''});
    }

    // EMITTER
    sendMessage(msg: string) {
        this.socket.emit('sendMessage', { payload: msg, topic: 'test1' });
        
        
    }

    

}
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

    // EMITTER
  sendMessage(msg: string) {
    this.socket.emit('recep', { payload: msg });
  }

  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('test1', msg => {
        observer.next(msg);
      });
    });
  }

}
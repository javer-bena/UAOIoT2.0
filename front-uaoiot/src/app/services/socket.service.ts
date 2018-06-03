import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import * as io from 'socket.io-client';

@Injectable()

export class SocketService{

    private socket;

    constructor(){
        this.socket = io();
    }

}
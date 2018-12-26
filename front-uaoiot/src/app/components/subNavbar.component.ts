import { Component, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { DashboardComponent } from './dashboard.component';

@Component({
    selector: 'sub-navbar',
    templateUrl: '../views/subNavbar.component.html',
    styleUrls: ['../styles/subNavbar.component.scss']
})

export class  SubNavbar{
    
    public display: boolean = false;
    public typeDataChart;
    @Output() subNavbarEvent = new EventEmitter<string>();

    constructor(
        private socketService:SocketService, 
    ){}

    ngOnInit(){
        this.typeDataChart ='';
    }

    showDialogTypeChart(){
        this.display = true;
    }

    sendData(){
        this.subNavbarEvent.emit(this.typeDataChart);
        this.display = false;
        //this.typeDataChart = 'line';
    }
}
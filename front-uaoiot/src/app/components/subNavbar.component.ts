import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { DashboardComponent } from './dashboard.component';
import { MenuItem } from '../../../node_modules/primeng/api';

@Component({
    selector: 'sub-navbar',
    templateUrl: '../views/subNavbar.component.html',
    styleUrls: ['../styles/subNavbar.component.scss']
})

export class  SubNavbar{
    
    public display: boolean = false;
    public typeDataChart;
    public titleDataChart;
    public titleDialog:String; 
    public stepItems:MenuItem[];
    public activeIndex: number = 0;
    public dataToChart;


    @Output() subNavbarEvent = new EventEmitter<string>();

    constructor(
        private socketService:SocketService, 
    ){}

    ngOnInit(){
        this.dataToChart = {
            type: "",
            title: ""
        };

        this.titleDialog = "Selecciona un tipo de gráfica";
        this.activeIndex = 0;
        this.stepItems = [
            {
                label:"Tipo de gráfica",
                command: (event:any)=>{
                    this.activeIndex = 0;
                    this.titleDialog = "Selecciona un tipo de gráfica";
                    //alert("Item 1");
                }
            },

            {
                label:"Título",
                command: (event:any)=>{
                    this.activeIndex = 1;
                    this.titleDialog = "Selecciona un título para la gráfica";
                    //alert("Item 2");
                }
            },

            {
                label:"Valores",
                command: (event:any)=>{
                    this.activeIndex = 2;
                    this.titleDialog = "Seleccionar valores a graficar";
                }
            },

            {
                label:"Terminar",
                command:(event:any)=>{
                    this.display = false;
                    this.sendData();
                    this.activeIndex = 0;
                    this.dataToChart = {
                        type: "",
                        title: ""
                    };
                }
            }
        ];
    }

    showDialogTypeChart(){
        this.display = true;
    }

    sendData(){
        this.subNavbarEvent.emit(this.dataToChart);
        this.display = false;
        //this.typeDataChart = 'line';
    }
}
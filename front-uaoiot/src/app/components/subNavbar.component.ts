import { Component, Output, Input, EventEmitter, ViewEncapsulation, ChangeDetectorRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { DashboardComponent } from './dashboard.component';
import { MenuItem } from '../../../node_modules/primeng/api';
import { Router } from '../../../node_modules/@angular/router';
import { ProjectService } from '../services/project.service';

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
    public variablesData;
    public nameProject;
    public color2:string = '#1976D2';
    public colors = ['#1976D2','#c42727','#bda235', '#50bd35'];

    @Output() subNavbarEvent = new EventEmitter<string>();
    @Input() deviceVariables;
    public _deviceVariables;

    constructor(
        private socketService:SocketService,
        private cd: ChangeDetectorRef,
        private router:Router,
        private projectService:ProjectService
    ){}

    ngOnChanges(changes: SimpleChanges){
        const variables = changes.deviceVariables;
        //alert("PREV: " + variables.previousValue + " GOT: " + variables.currentValue);

        this._deviceVariables = variables.currentValue;

        for(var i = 0; i < this._deviceVariables.length; i++){

        }
    }

    ngOnInit(){

        this.getProjectInfo();

        this.dataToChart = {
            type: "",
            title: "",
            amount:"",
            colors:this.colors,

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
                label:"Variables",
                command: (event:any)=>{
                    this.activeIndex = 2;
                    this.titleDialog = "Selecciona las variables a graficar";
                }
            },

            {
                label:"Valores",
                command: (event:any)=>{
                    this.activeIndex = 3;
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
                        title: "",
                        amount:""
                    };
                }
            }
        ];
    }

    getProjectInfo(){
        let link = this.router.url;
        let idProject = link.replace('/dashboard/','');

        this.projectService.getProjectById(idProject).subscribe(data => {
            this.nameProject = data.project[0].name;
        },Error =>{
            alert("Error " + Error);
        })
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
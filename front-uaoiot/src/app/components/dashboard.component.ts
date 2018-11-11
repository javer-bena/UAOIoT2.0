import { Component,ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service'
import { SocketService } from '../services/socket.service'
import { Message } from '../models/message';
import { Http } from '@angular/http';
import { ChartComponent } from './chart.component';
import { timeout } from 'rxjs/operators';
import { SubNavbar } from './subNavbar.component';
import { DashboardService } from '../services/dashboard.service';
import { Router, ActivatedRoute } from '../../../node_modules/@angular/router';
import { ChartService } from '../services/chart.service';
import { Chart } from '../models/charts';

@Component({
    selector: 'dashboard',
    templateUrl: '../views/dashboard.component.html',
    styleUrls: ['../styles/dashboard.component.scss'],
    providers: [MessageService]
})

export class  DashboardComponent{
    
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    public components = [];
    public chart = ChartComponent;

    public messageObj:Message;
    public messages;
    public message;
    public post;
    public loaderChart;
    public alive:boolean;
    public messageToSend;
    public dataToChart = [];
    public dataChart:String;

    //User data to chart
    public userName:String;
    public projectName:String;
    public projectId:String;
    public chartsArray = [];

    parentMMessage = ["4:00 pm","5:00 pm", "6:00 pm"];

    constructor(private _http:Http, private _messageService:MessageService,
        private componentFactoryResolver: ComponentFactoryResolver, private socketService:SocketService,
        private chartService:ChartService, private router:Router){

        this.messages = [];
        this.alive = true;
    
    }

    
    ngAfterViewInit(): void{}
    
    ngOnInit(){   

        let link = this.router.url;
        this.projectId = link.replace('/dashboard/','');

        this.getCharts();
        
        //this.dataChart = this.subNavBarObj.typeDataChart;
        this.projectName = '';
        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userName = userProfile.user;    
        }else{
            this.userName = '';
        }

        this.socketService.sendDataMqtt('user6','test1','$2a$10$10TMIWzLv/waT621bFFeC.MuzAONgIaC7C1UTj76ROd/aKWCjqd92');
        //this.socketService.onNewMessageListen();
        this.dataToChart = [];
        
        
        //this.getLastData(2000,6);
        /*this._messageService.getMessages().subscribe(
            result => {
                var lastIndex = Object.keys(result.messages).length;
                var lastMessage = result.messages[lastIndex-1];        
                console.log(lastIndex);
                console.log(lastMessage);
                this.messageObj = new Message(lastMessage._id,
                    lastMessage.topic,
                    lastMessage.user,
                    lastMessage.payload,
                    lastMessage.clientID,
                    lastMessage.qos,
                    lastMessage.publicationDate);
            },
            error => {
                var errorMsj = <any>error;
                console.log('Error en la busqueda' + errorMsj);
            }
        )*/
    }

    getCharts(){
        this.chartService.getChartByProject(this.projectId).subscribe(data =>{

            var dataArray = data.chart;

            for(let data in dataArray){

                var chartObj = new Chart(dataArray[data].project,
                dataArray[data].user, dataArray[data].type, dataArray[data].datas,
                dataArray[data].labels, dataArray[data].title);

                this.chartsArray.push(chartObj);
            }
        },Error=>{
            alert(Error);
        });
    }

    createChart($event){
    
        this.dataChart = $event;
        this.addWidget(this.chart);
    }

    getDataToChart(){
        console.log("ESCUCHANDO SOCKET");
        this.socketService.onNewMessage().subscribe(data =>{

            this.dataToChart.push(data.payload);
            console.log("DATA DASHBOARD SOCKET: " + this.dataToChart);
        });
        
    }  

    sendMsg(){
        
        this.socketService.sendMessage(this.messageToSend);
        alert("Mensaje enviado con exitosamente");
        //alert("Mensage: " + this.messageToSend);
        this.messageToSend = '';
    }
    /**
     */
    getLastData(timeInterval,amountData): void{
        var obv = Observable.interval(timeInterval)
                            .startWith(0)
                            .takeWhile(() => this.alive)
                            .switchMap(() => this._messageService.getMessages())

                            
        this.post = obv.subscribe(
            result => {
                var lastIndex = Object.keys(result.messages).length;
                var lastMessage = result.messages[lastIndex-1];

                console.log(lastIndex);
                console.log(lastMessage);
                
                this.messageObj = new Message(lastMessage._id,
                    lastMessage.topic,
                    lastMessage.user,
                    lastMessage.payload,
                    lastMessage.clientID,
                    lastMessage.qos,
                    lastMessage.publicationDate);

                this.message = this.messageObj.payload;
                this.messages.push(this.message);

                console.log(this.messages);

                if (this.messages.length >= amountData){
                    console.log("TERMINA");
                    this.alive = false;
                    //this.closeConnection();
                }
                
            },
            error => {
                var errorMsj = <any>error;
                console.log('Error en la busqueda' + errorMsj);
            }

        )

    }
    
    getDataWithInterval(init,final):void{
        //TODO:Obtener datos según el rango recibido en los parámetros.
    }
    
    /**
     */
    checkConnection():boolean{
        //TODO: Verificar conexión con  api.
        return true;
    }

    closeConnection(){
        this.alive = false;
    }
    
    /**
     */
    addWidget(componentClass: Type<ChartComponent>):void{
        //TODO: Crear widget según el parámetro recibido.
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const component = this.container.createComponent(componentFactory);

        component.instance.createChart('line',["1:00 am","2:00 am", "3:00 am"],[46, 64, 13, 63, 24, 67, 78],
        [24, 45, 12, 52, 45, 35, 23]);
        // Push the component so that we can keep track of which components are created
        this.components.push(component);
    }

    /**
     */
    blockDashboard():boolean{
        //TODO: Bloquear el drag and drop en el dashboard.
        return true;
    }

    sendDataToChart(){}

    
}
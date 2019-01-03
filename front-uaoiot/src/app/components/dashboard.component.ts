import { Component,ComponentFactoryResolver, OnChanges, AfterViewInit, Type, ViewChild, ElementRef, ViewContainerRef, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
import { Charts } from '../models/charts';


@Component({
    selector: 'dashboard',
    templateUrl: '../views/dashboard.component.html',
    styleUrls: ['../styles/dashboard.component.scss'],
    providers: [MessageService]
})

export class  DashboardComponent{
    
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    @ViewChild(ChartComponent) child;
    @ViewChild('charts', { read: ElementRef }) canvas: ElementRef;

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
    public lastData;
    public dataChart:String;

    //User data to chart
    public userName:String;
    public projectName:String;
    public projectId:String;
    public chartsArray = [];

    public chartsInput = [Charts];

    public charts = [];
    public numberOfChart:any;

    parentMMessage = ["4:00 pm","5:00 pm", "6:00 pm"];

    constructor(private _http:Http, private _messageService:MessageService,
        private componentFactoryResolver: ComponentFactoryResolver, private socketService:SocketService,
        private chartService:ChartService, private router:Router,
        private cd: ChangeDetectorRef){

        this.messages = [];
        this.alive = true;
    
    }
    
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
        
        //this.socketService.sendDataMqtt('user1','test1','123456');
        this.socketService.sendDataMqtt('user4','test2','$2a$10$Cadv4axd9fb./MidU0aGTe72V0FV2/HQHTBtx2qkBxUPNyO52WVm.');
        //this.socketService.sendDataMqtt('user6','test1','$2a$10$10TMIWzLv/waT621bFFeC.MuzAONgIaC7C1UTj76ROd/aKWCjqd92');
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

            this.chartsArray = [];
            var dataArray = data.chart;
            this.numberOfChart = dataArray.length;

            for(let data in dataArray){

                var chartObj = new Charts(dataArray[data]._id,dataArray[data].project,
                dataArray[data].user, dataArray[data].type, dataArray[data].datas,
                dataArray[data].labels, dataArray[data].title);

                this.chartsArray.push(chartObj);
            }

            //this.chartsInput = this.chartsArray;
            //this.child.setArrayChart(this.chartsArray);
            //this.child.charts = this.chartsArray
            this.child.setArrayChart(this.chartsArray);
            this.child.createChart(this.chartsArray);

        },Error=>{
            alert(Error);
        });
    }

    /**
     * 
     * @param $event 
     */
    getTypeChart($event){
        var data = $event

        //alert(data.type);
        this.addChart(data);
    }

    
    addChart(data){

        const chartJson = {
            project : this.projectId,
            user : this.userName,
            type : data.type,
            datas : [10,15,20,25,30],
            labels : ["1","2","3","4","5"],
            title : data.title
        }

        this.chartService.postChart(chartJson).subscribe(data=>{
            alert('Gráfica creada');

            this.getCharts();
            this.cd.markForCheck();
            
        },Error=>{
            alert('Error al crear la gráfica');
        });

        
        //window.location.reload();
        //this.router.navigateByUrl('/dashboard/' + this.projectId, {skipLocationChange: true}).then(()=>
        //this.router.navigate(["DashboardComponent"])); 

    }

    getDataToChart(){
        alert("ESCUCHANDO SOCKET");
        this.socketService.onNewMessage().subscribe(data =>{

            this.dataToChart.push(data.payload);
            this.lastData = this.dataToChart[this.dataToChart.length - 1];
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
        /*var obv = Observable.interval(timeInterval)
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

        )*/

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

        //component.instance.createChart();
        // Push the component so that we can keep track of which components are created
        this.components.push(component);

        console.log("WIDGET FACTORY: " + componentFactory.inputs);
        console.log("WIDGET COMPONENT: " + component.injector);
        console.log("WIDGET COMPONENTS: " + this.components);
    }

    /**
     */
    blockDashboard():boolean{
        //TODO: Bloquear el drag and drop en el dashboard.
        return true;
    }

    sendDataToChart(){}

    
}
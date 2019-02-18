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
import { DeviceService } from '../services/device.service';
import { Device } from '../models/device';
import { TokenService } from '../services/token.service';


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
    public listenChecked:boolean = true;
    public messageToSend;
    public dataToChart = [];
    public labelsToChart = [];
    public cols: any[];
    public lastData;
    public dataChart:String;
    public datesToChart = ["1","2","5","4"];
    //User data to chart
    public userName:String;
    public projectName:String;
    public userToken:String;
    public projectId:String;
    public chartsArray = [];

    public chartsInput = [Charts];

    public charts = [];
    public numberOfChart:any;

    public devicesArray = [];  
    public filteredDevicesArray = [];
    public nameDevice;
    public deviceVariables = [];
    public multivariables:boolean = false;

    parentMMessage = ["4:00 pm","5:00 pm", "6:00 pm"];

    constructor(private _http:Http, 
        private _messageService:MessageService,
        private componentFactoryResolver: ComponentFactoryResolver, 
        private socketService:SocketService,
        private chartService:ChartService,
        private deviceService:DeviceService,
        private tokenService:TokenService,
        private router:Router,
        private cd: ChangeDetectorRef){

        this.messages = [];
        this.alive = true;
    
    }
    
    ngOnInit(){   

        this.nameDevice = '';
        let link = this.router.url;
        this.projectId = link.replace('/dashboard/','');

        this.getCharts();
        this.getDevices();
        //this.dataChart = this.subNavBarObj.typeDataChart;
        this.projectName = '';
        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userName = userProfile.user;    
        }else{
            this.userName = '';
        }
        
        this.getToken();
        //this.socketService.sendDataMqtt('user1','test1','123456');
        //this.socketService.sendDataMqtt('user4','test2','$2a$10$Cadv4axd9fb./MidU0aGTe72V0FV2/HQHTBtx2qkBxUPNyO52WVm.');
        
        //this.socketService.sendDataMqtt('user6','test1','$2a$10$10TMIWzLv/waT621bFFeC.MuzAONgIaC7C1UTj76ROd/aKWCjqd92');
        //this.socketService.onNewMessageListen();
        this.cols = [
            { field: 'payload', header: 'Dato' }
        ];

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

    /**
     * Enviar datos para conexión mqtt del usuario.
     * @param user Usuario que se utiliza para la conexión mqtt.
     * @param topic Topico para suscribirse al broker.
     * @param token Token (Password) para la conexión.
     */
    sendUserDataMqtt(user,topic,token){

        this.socketService.sendDataMqtt(user,topic,token);
        //alert(user + " - " + topic + " - " + token);
    }

    sendDeviceListenDataMqtt(name,amount,delay){}

    getToken(){
        this.tokenService.getTokenByUser(this.userName).subscribe(data=>{
            var resData = data.token[0];
            this.userToken = resData.value;

            //this.sendUserDataMqtt(this.userName,this.nameDevice + "_" + this.userName,this.userToken);

        },Error=>{
            alert("Error " + Error);
        })
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
     */
    getDevices(){
        this.deviceService.getDeviceByProject(this.projectId).subscribe(data =>{

            this.devicesArray = [];
            var dataArray = data.device;

            for(let data in dataArray){

                var deviceObj = new Device(dataArray[data]._id,dataArray[data].name,
                    dataArray[data].user,dataArray[data].project,dataArray[data].projectId, dataArray[data].variables);
                
                this.devicesArray.push(deviceObj);
            }

        },Error=>{
            alert(Error); 
        });
    }

    /**
     * @param event
     */
    filterDevice(event){
        this.filteredDevicesArray = [];

        for(let i = 0; i < this.devicesArray.length; i++){
            var device = this.devicesArray[i].name;

            if(device.toLowerCase().indexOf(event.query.toLowerCase()) == 0){
                this.filteredDevicesArray.push(device);
            }
        }
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

        if(this.dataToChart.length == 0){
            alert("No hay datos para graficar");   

        }else{

            if(data.amount === "allData"){

                var datasets = [];
                var attr;
                
                if(this.multivariables){

                    var dataset = [];
                    var tempArray = [];
                    var i = 0;
                    var j = 0;
                    var lengthDataArray = this.dataToChart.length;
                    
                    for(j = 0; j < lengthDataArray; j++){
                        
                        /*if(j > 0 && i > 0 && tempArray.length == 0 ){

                            tempArray.push(this.dataToChart[0][i]);
                            
                        }else{
                            
                            tempArray.push(this.dataToChart[j][i]);
                        }*/
                        tempArray.push(this.dataToChart[j][i]);
                        
                        //console.log("DRAW: " + j +" - " + i + " " + tempArray + " len: " + tempArray.length);

                        if(tempArray.length == 1 && j==1 && i==1){
                            tempArray.splice(0,0,this.dataToChart[0][i]);
                        }

                        if(tempArray.length == lengthDataArray){
                            
                            j = 0;
                            i++;
                            //lengthDataArray++;
                            dataset.push(tempArray);
                            //console.log("DRAW IF: " + this.dataToChart[0][i]);
                            tempArray = [];
                            //tempArray.push(this.dataToChart[0][i]);
                            //continue;
                        }
                        
                    }
                    
                    //dataset.push(tempArray);
                    //console.log("DRAW DATASET: " + dataset + " - " + tempArray);

                    for(var i = 0; i < dataset.length; i++){
                        console.log("DRAW DATASET: " + data.colors[i]);
                        attr = {
                            data: dataset[i],
                            borderColor: data.colors[i],
                            fill: false
                        }
                        datasets.push(attr);
                    }
                    //while(){}

                    /*for(let j = 0; j < this.dataToChart.length  ; j++){
                        for(let i = 0; i < j + 1; i++){

                            //console.log("DRAW C: " + this.dataToChart[j]);

                            console.log("DRAW: " + j +" - " + i + " " + this.dataToChart[j][i]);
                            
                            attr = {
                                data: this.dataToChart[j],
                                borderColor: data.colors[j],
                                fill: false
                            }
                            datasets.push(attr);
                        }
                    }*/

                }else{
                    attr = {
                        data: this.dataToChart,
                        borderColor: "#3cba9f",
                        fill: false
                    }

                    datasets.push(attr);
                    
                }

                for (let i = 0; i < this.dataToChart.length; i++) {
                    this.labelsToChart.push("lbl" + i);
                }

    
                const chartJson = {
                    project : this.projectId,
                    user : this.userName,
                    type : data.type,
                    datas : datasets,
                    labels : this.datesToChart,
                    title : data.title
                }
        
                this.chartService.postChart(chartJson).subscribe(data=>{
                    alert('Gráfica creada');
        
                    this.getCharts();
                    this.cd.markForCheck();
                    
                },Error=>{
                    alert('Error al crear la gráfica');
                });

            }else{

            }
            
        }

    }

    getDeviceVariables(nameDevice:String){
        
        for(let i = 0; i < this.devicesArray.length; i++){

            if(nameDevice === this.devicesArray[i].name){
                this.deviceVariables = this.devicesArray[i].variables
            }
        }

        return this.deviceVariables;

    }

    /**
     * 
     */
    getCurrentDate():string{
        
        var dateObj = new Date();
        var dateStr = dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getMilliseconds();

        return dateStr;
    }

    /**
     * 
     */
    listenDevice(){

        this.getDeviceVariables(this.nameDevice);

        if(!this.listenChecked){
            if(this.userName == "" || this.nameDevice == "" || this.userToken == ""){
            
                this.listenChecked = true;
                alert("No es posible la conexión. Faltan datos.");
                
            }else{
    
                alert("Escuchando dispositivo");
    
                //this.sendUserDataMqtt(this.userName,this.nameDevice + "_" + this.userName,this.userToken);
                this.sendUserDataMqtt(this.userName,"test2",this.userToken);

                this.socketService.onNewMessage().subscribe(data =>{
                    
                    var msgObj = new Message(data.payload,this.getCurrentDate());
                    var variables = this.getDeviceVariables(this.nameDevice);
                    var dataToShow = [];

                    if(data.payload.indexOf('[') > -1){
                        
                        if(variables.length > 1){
                            this.multivariables = true;
                        }else{
                            this.multivariables = false;
                        }
                        
                        var dataToArray = JSON.parse(data.payload);

                        for(let i = 0; i < variables.length; i++){
                            
                            //alert(dataToArray);
                            dataToShow.push(dataToArray[i]);
                            
                        }

                        //alert(dataToShow);
                        this.dataToChart.push(new Message(dataToShow,this.getCurrentDate()));
                        this.datesToChart.push(this.getCurrentDate());
                        //this.lastData = this.dataToChart[this.dataToChart.length - 1];

                    }else{
                        this.multivariables = false;
                        this.dataToChart.push(msgObj);
                        this.datesToChart.push(msgObj.date);
                        //this.dataToChart.push(data.payload);
                        this.lastData = this.dataToChart[this.dataToChart.length - 1];
                    }
                    
                });
            }
        
        }else{
            //TODO: Desconectar conexión
            alert("Desconectado");
        }
        
        
        
        
    }  

    sendMsg(){
        
        this.socketService.sendMessage(this.messageToSend);
        alert("Mensaje enviado exitosamente");
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
import { Component,ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service'
import { Message } from '../models/message';
import { Http } from '@angular/http';
import { ChartComponent } from './chart.component';

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

    constructor(private _http:Http, private _messageService:MessageService,
        private componentFactoryResolver: ComponentFactoryResolver){

        this.messages = [];
        
    } 
    ngOnInit(){   

        this.getLastData();
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
     */
    getLastData(): void{
        this.post = Observable
        .interval(1000) // call once per second
        .startWith(0)
        .switchMap(() =>this._messageService.getMessages()
        //.map(post => post[0])
        //.map(res => res.json())
        ).subscribe(
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
    
    /**
     */
    addWidget(componentClass: Type<any>):void{
        //TODO: Crear widget según el parámetro recibido.
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
        const component = this.container.createComponent(componentFactory);

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
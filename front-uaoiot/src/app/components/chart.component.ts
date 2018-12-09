import { Component, Input, OnChanges, SimpleChanges,OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service'
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { ChartService } from '../services/chart.service';
import { Charts } from '../models/charts';

@Component({
    selector: 'chart',
    templateUrl: '../views/chart.component.html',
    styleUrls: ['../styles/chart.component.scss'],
    providers: [MessageService]
})

export class ChartComponent{
    
    @ViewChild('canvas1', { read: ElementRef }) canvas: ElementRef;
    //public canvas;
    public chart;
    public chartObj;
    public prueba:number;
    //@Input() charts:[Charts];
    public charts;
    
    public pruebaData:string;

    public chartsData = [];
    public amountCharts;

    isDataLoaded:boolean = false;

    constructor(private chartService: ChartService,
        private cd: ChangeDetectorRef){
        //this.chart = [];
        //this.array = [Chart];
    }

    ngOnInit(){
        
        this.charts = [new Charts("5bdfb88005583d0ecce856a4",
        "user4","line",[33, 25, 22, 22],
        ["1:00 am","2:00 am", "3:00 am","","","",""]
        ,"Chart 1"),  
        
        new Charts("5bdfb88005583d0ecce856a4",
        "user4","line",[18, 41, 54, 13, 35, 22, 42],
        ["2:15 pm","2:30 pm", "2:45 pm","","","",""]
        ,"Chart 2"),
    
        new Charts("5bdfb88005583d0ecce856a4",
        "user4","line",[18, 41, 54, 13, 35, 22, 42],
        ["2:15 pm","2:30 pm", "2:45 pm","","","",""]
        ,"Chart 2")];
        console.log("CHARTS INIT" + this.charts);
    }

    setArrayChart(array){
        console.log("CHARTS " + array[0].datas);
        this.charts = array;
        this.cd.detectChanges();
    }

    ngAfterViewInit(){
        console.log("CHARTS AFTER " + this.charts[0].datas);
        this.isDataLoaded = true;
        //this.createChart(this.charts);
    }

    createChart(array){   

        //this.charts = array;
        
        console.log("CHARTS CREATE " + this.charts[0].datas);
        for(var i = 0; i < array.length; i++){
            this.chart = new Chart('canvas' + i,{
                type:'line',
                data: {
                    labels: array[i].labels,
                    datasets:[{
                        label: 'Data Dataset',
                        data: array[i].datas,
                        borderColor:"#3cba9f",
                        fill: false
                    },]
                },
                options:{
                    title: {
                        display: true,
                        text: array[i].title,
                        fontSize: 16
                    },
                    legend:{
                        display:false
                    },
                    scales:{
                        xAxes:[{
                            display:true
                        }],
                        yAxes:[{
                            display:true
                        }],
                    },
    
                    responsive:true
                }
            });
            
            //this.charts.push(chart);
            console.log("WIDGET CHART OBJ " + i );
            console.log("WIDGET CHART OBJ " + this.chart );
        }
        

    }


}
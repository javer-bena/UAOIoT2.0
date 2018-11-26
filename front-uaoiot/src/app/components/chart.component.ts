import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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

export class ChartComponent implements AfterViewInit{
    
    @ViewChild('canvas1', { read: ElementRef }) canvas: ElementRef;
    //public canvas;
    public chart;
    public chartObj;
    public prueba = 2;
    @Input() charts:[Charts];
   /*public charts = [new Charts("5bdfb88005583d0ecce856a4",
                    "user4","line",[28, 21, 34, 33, 25, 22, 22],
                    ["1:00 am","2:00 am", "3:00 am"],"Chart 1"),
                    
                    new Charts("5bdfb88005583d0ecce856a4",
                    "user4","line",[18, 41, 54, 13, 35, 22, 42],
                    ["2:15 pm","2:30 pm", "2:45 pm"],"Chart 2")];*/


    public chartsData = [];
    public amountCharts;

    constructor(private chartService: ChartService){
        //this.chart = [];
        //this.array = [Chart];
    }

    ngOnInit(){
        
        //this.createChart('line',["1:00 m","2:00 am", "3:00 am"],[28, 21, 34, 33, 25, 22, 22],[24, 45, 22, 22, 19, 35, 23]);
        
        console.log("WIDGET ARRAY CHARTS " + this.charts.length);

        
    }

    ngOnChanges(changes: SimpleChanges){

        console.log("WIDGET ARRAY CHARTS CHANGES " + this.charts.length);
        console.log("WIDGET ARRAY CHARTS CHANGES " + this.charts[0].datas);
        this.createChart();
    }

    ngAfterViewInit(){
        
        //this.createChart();
    
        //this.canvas = document.getElementById('canvas');
        
    }

    createChart(){    
    
        for(var i = 0; i < this.charts.length; i++){
            this.chart = new Chart('canvas' + i,{
                type:'line',
                data: {
                    labels: this.charts[i].labels,
                    datasets:[{
                        label: 'Data Dataset',
                        data: this.charts[i].datas,
                        borderColor:"#3cba9f",
                        fill: false
                    },]
                },
                options:{
                    title: {
                        display: true,
                        text: this.charts[i].title,
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
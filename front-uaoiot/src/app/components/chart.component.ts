import { Component, Input, OnChanges, SimpleChanges,OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})

export class ChartComponent{
    
    @ViewChild('canvas1', { read: ElementRef }) canvas: ElementRef;
    //public canvas;
    public displayDelete:boolean = false;
    public idChartToDelete;
    public chart;
    public chartObj;
    public prueba:number;
    //@Input() charts:[Charts];
    public charts;
    public pruebaData:string;
    public chartsData = [];
    public amountCharts;
    public projectId; 

    constructor(private chartService: ChartService,
        private cd: ChangeDetectorRef){

        
    }

    ngOnInit(){ 
        this.charts = [];
    }

    setArrayChart(array){   
        this.charts = array;
        this.cd.detectChanges();
    }

    ngAfterViewInit(){}

    createChart(array){   

        for(var i = 0; i < array.length; i++){
            
            this.chart = new Chart('canvas' + i,{
                type:'line',
                data: {
                    labels: array[i].labels,
                    datasets:array[i].datas
                    /*datasets:[{
                        label: 'Data Dataset',
                        data: array[i].datas,
                        borderColor:"#3cba9f",
                        fill: false
                    },]*/
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
            
        }
    }

    showDialogDeleteChart(index){
        
        this.idChartToDelete = this.charts[index].id;
        this.displayDelete = true;
    }

    getAllCharts(){

        this.chartService.getChartByProject("5c170ba3843ab81560300cce").subscribe(data => {
            
            this.charts = [];
            var dataArray = data.chart;
            
            for(let data in dataArray){
                
                var chartObj = new Charts(dataArray[data]._id,dataArray[data].project,
                    dataArray[data].user, dataArray[data].type, dataArray[data].datas,
                    dataArray[data].labels, dataArray[data].title);
                
                    this.charts.push(chartObj);
            }

            this.setArrayChart(this.charts);
            this.createChart(this.charts);

        },Error=>{
            alert("Error " + Error);
        });
    }

    deleteChart(){

        this.chartService.deleteChartsById(this.idChartToDelete).subscribe(data=>{
            this.displayDelete = false;
            alert("eliminada");
            
            this.getAllCharts();
            
        },Error=>{
            alert("ERROR " + Error);
            this.displayDelete = false;
        });
    }


}
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../services/message.service'
import { Http } from '@angular/http';
import { Chart } from 'chart.js';

@Component({
    selector: 'chart',
    templateUrl: '../views/chart.component.html',
    styleUrls: ['../styles/chart.component.scss'],
    providers: [MessageService]
})

export class ChartComponent{
    
    public chart;

    contructor(){
        this.chart = [];
    }

    ngOnInit(){
        this.createChart('line',["1:00 pm","2:00 pm", "3:00 pm"],[28, 21, 34, 33, 25, 22, 22],
        [24, 45, 22, 22, 19, 35, 23]);
    }

    createChart(type:string,labels,data1,data2){    
        this.chart = new Chart('canvas',{
            type:'line',
            data: {
                labels: labels,
                datasets:[{
                    data: data1,
                    borderColor:"#3cba9f",
                    fill: false
                },
                {
                    data: data2,
                    borderColor:"#ff0000",
                    fill: false
                },]
            },
            options:{
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
                }
            }
        });
    }

}
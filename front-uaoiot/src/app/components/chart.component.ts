import { Component, Input } from '@angular/core';
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
        //this.createChart('line',this.chartDataMessage,[28, 21, 34, 33, 25, 22, 22],[24, 45, 22, 22, 19, 35, 23]);
    }

    createChart(type:string,labels,data1,data2){    
        this.chart = new Chart('canvas',{
            type:'line',
            data: {
                labels: labels,
                datasets:[{
                    label: 'Data Dataset',
                    data: data1,
                    borderColor:"#3cba9f",
                    fill: false
                },
                {
                    label: 'Data 2',
                    data: data2,
                    borderColor:"#ff0000",
                    fill: false
                },]
            },
            options:{
                title: {
                    display: true,
                    text: 'My Title',
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
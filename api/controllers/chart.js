'use strict'

var Chart = require('../models/chart');


/**
 * Método para consultar las graficas de un proyecto.
 * @param {*} req 
 * @param {*} res 
 */
function getChartProject(req,res){
    
    var chartProject = req.params.project;

    Chart.find({user : chartProject},['user','name'], (err,chart) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!chart){
                res.status(404).send({ message: "Este proyecto no existe"});

            }else if(chart.length == 0){
                res.status(200).send({ message: "Este proyecto no tiene graficas"});

            }else{
                res.status(200).send({ chart });
            }
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function postChart(req, res){
    
    var chart = new Chart();
    var params = req.body;

    chart.project = params.project;
    chart.user = params.user;
    chart.type = params.type;
    chart.datas = params.datas;
    chart.labels = params.labels;
    chart.title = params.title;
    
    chart.save((err, chartStored) => {
        if(err){
            
            res.status(404).send({ message: 'Error ' + err});
        }else{
            res.status(200).send({ device: chartStored });
        }
    });
}

module.exports = {
    getChartProject,
    postChart
}
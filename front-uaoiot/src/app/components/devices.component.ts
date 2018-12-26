import { Component } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project';
import { Device } from '../models/device';

@Component({
    selector: 'devices-view',
    templateUrl: '../views/devices.component.html',
    styleUrls: ['../styles/devices.component.scss']
})

export class DevicesComponent{

    public userDevice:String;
    public idProject:String;
    public nameProject:String;
    public nameDevice:String;
    public display:boolean;
    public displayDelete:boolean;
    public filteredProject:String;
    public filteredProjectsArray = [];
    public idDeviceToDelete:String;
    public deviceObj:Device;
    public variablesArray = [];
    public projectsArray = [];
    public devicesArray = [];

    constructor(
        private deviceService: DeviceService,
        private projectService: ProjectService
    ){}

    ngOnInit(){

        this.nameProject = "";
        this.nameDevice = "";

        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userDevice = userProfile.user;    
        }else{
            this.userDevice = '';
        }

        this.getUserProjects(this.userDevice);
        this.getAllDevices(this.userDevice);
    }

    /**
     * 
     */
    filterProject(event){
        this.filteredProjectsArray = [];
        
        for(let i = 0; i < this.projectsArray.length; i++){

            var project = this.projectsArray[i].name;

            //this.nameProject = project;
            //this.filteredProject = project;
            
            if(project.toLowerCase().indexOf(event.query.toLowerCase()) == 0){

                this.filteredProjectsArray.push(project);
                
                //this.nameProject = this.filteredProjectsArray[i];
            
            }
        }

    }

    showDialogDeleteDevice(index){
        this.idDeviceToDelete = this.devicesArray[index].id;
        this.displayDelete = true;
    }

    deleteDevice(){
        this.deviceService.deleteDevice(this.idDeviceToDelete).subscribe(data =>{
            this.displayDelete = false;
            alert("Dispositivo eliminado exitosamente");
            this.getAllDevices(this.userDevice);

        },Error=>{
            this.displayDelete = false;
            alert("Error al eliminar el dispositivo." + Error);
        })
        
        
        
    }

    /**
     * 
     * @param name 
     * @param user 
     * @param project 
     */
    addDevice(name:String, user:String, project:String,projectId:String, variables){

        if(name === "" || user === "" || project === ""){
            alert("faltan datos");
        }else{
            
            const device = {
                name: name,
                user: user,
                project: project,
                projectId:projectId,
                variables: variables
            };

            this.deviceService.postDevice(device).subscribe(data =>{
                
                this.getAllDevices(this.userDevice);

            },Error=>{
                alert('Algo salió mal');
            });

            //alert("name: " + name + " user: " + user + " project: " + project + " variables:" + variables);
            this.display = false;
        }
        
        
    }

    getAllDevices(userName){


        this.devicesArray = [];

        this.deviceService.getDeviceByUserName(userName).subscribe(data =>{

            var datasArray = data.device;

            for (let datas in datasArray){
                
                var deviceObj = new Device(datasArray[datas]._id,datasArray[datas].name, datasArray[datas].user, datasArray[datas].project,
                    datasArray[datas].projectId, datasArray[datas].variables);
                //var deviceObj = new Device(datasArray[datas].name, datasArray[datas].user, datasArray[datas].project, datasArray[datas].variables);
                this.devicesArray.push(deviceObj);
                console.log("DEVICE: " + datasArray[datas].project);
            }

        },Error=>{

        });
    }

    /**
     * 
     */
    getUserProjects(userName){
        this.projectService.getProjectByUserName(userName).subscribe(data =>{
            
            var datasArray = data.project;
        
            for (let datas in datasArray){
                
                var projectObj = new Project(datasArray[datas]._id, datasArray[datas].name, datasArray[datas].user);
                this.projectsArray.push(projectObj);      
            }

        },Error=>{

        });
    }

    /**
     * 
     */
    getDeviceData(){
        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userDevice = userProfile.user;    
            
        }else{
            this.userDevice = '';
        }

        var encodeStringName = this.nameProject.split(' ').join('%20');

        this.projectService.getProjectByName(encodeStringName).subscribe(data =>{
            this.idProject =  data.project[0]._id;

            //alert(this.idProject + ' ' + encodeStringName);
            this.addDevice(this.nameDevice,this.userDevice,this.nameProject,this.idProject,this.variablesArray);

        },Error=>{});
        
        
        //this.addDevice(this.nameDevice,this.userDevice,this.nameProject,this.variablesArray);
        

    }


    showDialogAddDevice(){
        
        this.nameProject = '';
        this.nameDevice = '';
        this.variablesArray = [];
        this.display = true;
    }
}
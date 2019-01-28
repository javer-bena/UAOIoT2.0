import { Component } from '@angular/core';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { UserLoginService } from '../services/userLogin.service';
import { DashboardService } from '../services/dashboard.service';
import { PermissionService } from '../services/permission.service';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ChartService } from '../services/chart.service';
import { DeviceService } from '../services/device.service';

@Component({
    selector: 'project',
    templateUrl: '../views/project.component.html',
    styleUrls: ['../styles/project.component.scss']
})

export class ProjectComponent{
    public projectsArray = [];
    public projectObj:Project;
    public nameProject:String;
    public userProject:String;
    public display:boolean;
    public displayDelete:boolean = false;
    public displayUpdate:boolean = false;
    public idProjectToDelete:String;
    public idProjectToUpdate:String;
    public idProject;

    constructor(
        private projectService:ProjectService,
        private userLoginService: UserLoginService,
        private chartService: ChartService,
        private deviceService: DeviceService,
        private dashboardService: DashboardService,
        private permissionService: PermissionService,
        private router: Router){}

    ngOnInit(){

        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userProject = userProfile.user;    
        }else{
            this.userProject = '';
        }

        this.getAllProjects(this.userProject);

        //this.getProjectData();
    }

    goToDashboard(index){
        this.router.navigate(['dashboard/' + this.projectsArray[index].id]);
    }

    /**
     * Método para obtener todos los proyectos de un usuario.
     */
    getAllProjects(userName){
        
        this.projectsArray = [];

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
     * Método para obtener los datos de un proyecto.
     */
    getProjectData(){
        if(localStorage.getItem('user') != null){
            var userProfile = JSON.parse(localStorage.getItem('user'));
            this.userProject = userProfile.user;    
        }else{
            this.userProject = '';
        }

        this.addProject(this.nameProject,this.userProject);

        this.display = false;

    }
    
    
    showDialogAddProject(){
        this.display = true;
    }

    showDialogDeleteProject(index){
        //alert(this.projectsArray[index].id);
        this.idProjectToDelete = this.projectsArray[index].id;
        this.displayDelete = true;
    }

    showDialogUpdateProject(index){
        //alert(this.projectsArray[index].id);
        this.idProjectToUpdate = this.projectsArray[index].id;
        this.displayUpdate = true;
        this.nameProject = this.projectsArray[index].name;
    }

    updateProject(){
        const projectJson = {
            name: this.nameProject,
            user: this.userProject
        };

        this.projectService.updateProject(projectJson,this.idProjectToUpdate).subscribe(data=>{

            //TODO: Update permission.
            this.getAllProjects(this.userProject);
            this.displayUpdate = false;

        },Error=>{

        });

    }

    /**
     * Método para eliminar un proyecto y las gráficas y dispoitivos asociados.
     */
    deleteProject(){
        this.projectService.deleteProject(this.idProjectToDelete).subscribe(data =>{
            
            this.displayDelete = false;
            alert("Proyecto eliminado exitosamente");
            
            this.chartService.deleteChartsByProject(this.idProjectToDelete).subscribe(data => {},Error =>{});
            this.deviceService.deleteDevicetByProject(this.idProjectToDelete).subscribe(data => {},Error=>{}); 
            
            this.getAllProjects(this.userProject);

        },Error=>{
            this.displayDelete = false;
            alert("Error al eliminar el proyecto." + Error);
        });

    }

    
    addProject(name:String,user:String){
        
        //this.projectObj = new Project(name,user);

        const projectJson = {
            name: name,
            user: user
        };

        this.projectService.postProject(projectJson).subscribe(data =>{
            this.idProject = data.project;
            
            const permission = {
                user: user,
                topic: name + "_" + user,
                permission: 'READWRITE'
            }

            const dashboard = {
                project: this.idProject._id,
                user: user
            }

            //alert(permission.topic);
            //this.createNewPermission(permission);
            //this.createDashboard(dashboard);
            this.getAllProjects(user);

        },Error=>{
            alert("Algo salio mal");
        })

        this.nameProject = '';
        
    }

    createNewPermission(permission){
        this.permissionService.postPermission(permission).subscribe(data =>{

        },Error=>{

        });
    }

    createDashboard(dashboard){
        this.dashboardService.postDashboard(dashboard).subscribe(data =>{

        },Error=>{

        });
    }
}
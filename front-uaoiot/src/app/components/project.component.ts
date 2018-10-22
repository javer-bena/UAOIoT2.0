import { Component } from '@angular/core';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { UserLoginService } from '../services/userLogin.service';
import { DashboardService } from '../services/dashboard.service';
import { PermissionService } from '../services/permission.service';

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
    public idProject;

    constructor(
        private projectService:ProjectService,
        private userLoginService: UserLoginService,
        private dashboardService: DashboardService,
        private permissionService: PermissionService){}

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

    goToDashboard(){}

    /**
     * 
     */
    getAllProjects(userName){
        
        this.projectsArray = [];

        this.projectService.getProjectByUserName(userName).subscribe(data =>{
            
            var datasArray = data.project;
        
            for (let datas in datasArray){
                
                var projectObj = new Project(datasArray[datas].name, datasArray[datas].user);
                this.projectsArray.push(projectObj);      
            }

        },Error=>{

        });
    }

    /**
     * 
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
    
    /**
     * 
     */
    showDialogAddProject(){
        this.display = true;
    }

    /**
     * 
     */
    addProject(name:String,user:String){
        
        this.projectObj = new Project(name,user);

        const projectJson = {
            name: this.projectObj.name,
            user: this.projectObj.user
        };

        this.projectService.postProject(projectJson).subscribe(data =>{
            this.idProject = data.project;
            
            const permission = {
                user: this.projectObj.user,
                topic: this.projectObj.name + "_" + this.projectObj.user,
                permission: 'READWRITE'
            }

            const dashboard = {
                project: this.idProject._id,
                user: this.projectObj.user
            }

            alert(permission.topic);
            //this.createNewPermission(permission);
            //this.createDashboard(dashboard);
            this.getAllProjects(this.projectObj.user);

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
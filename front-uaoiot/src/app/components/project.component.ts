import { Component } from '@angular/core';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { UserLoginService } from '../services/userLogin.service';

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
        private userLoginService: UserLoginService){}

    ngOnInit(){

        //this.getProjectData();
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
            //alert("Proyecto creado con exito: " + this.dataTest.name);
            console.log("Proyecto creado con exito: " + this.idProject._id);
        },Error=>{
            alert("Algo salio mal");
        })

        this.nameProject = '';
        
    }
}
import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { CRUDService } from '../service/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  taskForm!: FormGroup;

  taskObj : Task = new Task();
  taskArray: Task[] = [];
  addTaskValue: string = '';
  private bsModalRef!: BsModalRef;

  //task field form initilization and validation
  createTaskField(){
    this.taskForm = this.formBuilder.group({
      addTaskValue : ['',[Validators.required]],
    })
  }
  get taskvalue(){
    return this.taskForm.get('addTaskValue');
  }

  //method to add new task
  addTask(){
    this.taskObj.task_name = this.addTaskValue;
    if(this.addTaskValue == ''){
      alert("Please enter a task");
    } 
    else {
    this.crudService.addTask(this.taskObj).subscribe(res =>{
        this.ngOnInit();
        this.addTaskValue = '';
      },err =>{
        alert("Could not add task");

        //condition added for code to work offline
        if(err.status == 0){
          this.taskArray.push(this.taskObj);
          this.addTaskValue = '';
        }
      })
    }
  }

  //method to get task list
  getAllTask(){
    this.crudService.getAllTask().subscribe(res =>{
      this.taskArray = res;
    },err =>{
      alert("Unable to get task list");
    })
  }

  //method to edit an exising task
  editTask(){
    this.originalValue = this.editTaskValue;
    if(this.editTaskValue == ''){
      alert("Task name cannot be empty");
      this.editTaskValue = this.originalValue; 
    } else {
      this.taskObj.task_name = this.editTaskValue;
      this.crudService.editTask(this.taskObj).subscribe(res =>{
        this.ngOnInit();
      },err =>{
        alert("Failed to update the task");

        //condition added for code to work offline
        if(err.status == 0){
          this.taskObj.task_name = this.editTaskValue;
          this.taskArray.push(this.taskObj);
        }
      })
    }
  }

  //method to delete a task
  deleteTask(etask: Task, i:any){
    this.crudService.deleteTask(etask).subscribe(res =>{
      this.ngOnInit();
    },err =>{
      alert("Unable to delete task");
      
      //condition added for code to work offline
      if(err.status == 0){
        this.taskArray.splice(i,1)
      }
    })
  }

  //method to open edit task modal
  openEditTaskModal(task:any){
    this.bsModalRef = this.modalService.show(ModalComponent, {
      animated: true,
      backdrop: true,
      class: 'modal-md modal-dialog-centered',
    });
    (this.bsModalRef.content as ModalComponent).getEditTaskData(task);
    (this.bsModalRef.content as ModalComponent).onCloseModal.subscribe(e => {
      if (e) this.getAllTask();
    })
  }

    private formBuilder: FormBuilder,
    private modalService: BsModalService,

  ngOnInit(): void {
    this.createTaskField();
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.taskArray = [];
    this.getAllTask();
  }

}

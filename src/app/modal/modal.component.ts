import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Task } from '../model/task';
import * as alertifyjs from 'alertifyjs';
import { CRUDService } from '../service/crud.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  
  public onCloseModal : Subject<any> = new Subject();

  taskForm!: FormGroup;
  taskObj : Task = new Task();
  taskID: any;

  ngOnInit(): void {
    this.createTaskField();
  }

  //initialize and validate the edit task field
  createTaskField(){
    this.taskForm = this.formBuilder.group({
      editTaskValue: ['',Validators.required],
    })
  }
  
  //patch task value to edit field
  getEditTaskData(task:any){
    this.taskForm.patchValue({
      editTaskValue : task.task_name,
    });
    this.taskID = task.id;
  }

  //method to update a task
  editTask(){
    let editValue = JSON.parse(JSON.stringify(this.taskForm.value));
    this.taskObj.id = this.taskID;
    this.taskObj.task_name = editValue.editTaskValue;
    this.crudService.editTask(this.taskObj).subscribe(res =>{
      this.taskForm.reset();
      this.onClose(true);
        },err =>{
          alertifyjs.error("Failed to update the task");
        })
  }

  constructor(
    private bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private crudService: CRUDService,
    ) { }

  //to close the modal  
  onClose(refresh?: boolean) {
    this.bsModalRef.hide();
    this.onCloseModal.next(refresh || false);
  } 
}

import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Task } from '../model/task';
import { CRUDService } from '../service/crud.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  originalValue: any;
  isValueSame: boolean = false;
  editValue: any;
  taskDueDate: any;
  taskCreatedDate: any;
  isCompleted: any;
  attachment: any;
  taskType: any;

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
    this.originalValue = task.task_name;
    this.taskDueDate = task.taskDueDate;
    this.taskCreatedDate = task.taskCreatedDate;
    this.isCompleted = task.isCompleted;
    this.attachment = task.attachment;
    this.taskType = task.taskType;
    this.isValueSame = true;
  }

  //method to update a task
  editTask(){
    let editValue = JSON.parse(JSON.stringify(this.taskForm.value));
    this.taskObj._id = this.taskID;
    this.taskObj.task_name = editValue.editTaskValue;
    this.taskObj.taskDueDate = this.taskDueDate;
    this.taskObj.taskCreatedDate = this.taskCreatedDate;
    this.taskObj.isCompleted = this.isCompleted;
    this.taskObj.attachment = this.attachment;
    this.taskObj.taskType = this.taskType;
    this.crudService.editTask(this.taskObj).subscribe(res =>{
      this.taskForm.reset();
      this.onClose(true);
      setTimeout(() => {
        this.toastr.success('Task updated successfully');  
      }, 500);
    })
  }

  //disables update button if same as original value
  checkEditValue(){
    if(this.originalValue === this.editValue){
      this.isValueSame = true;
    }else{
      this.isValueSame = false;
    }
  }

  constructor(
    private bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private crudService: CRUDService,
    private toastr: ToastrService
    ) { }

  //to close the modal  
  onClose(refresh?: boolean) {
    this.bsModalRef.hide();
    this.onCloseModal.next(refresh || false);
  } 
}

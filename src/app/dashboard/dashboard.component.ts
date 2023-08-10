import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { CRUDService } from '../service/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';

interface AppState {
  message: string;
}
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
  onlineEvent: Observable<Event> | undefined;
  offlineEvent: Observable<Event> | undefined;
  subscriptions: Subscription[] = [];
  connectionStatusMessage: string | undefined;
  connectionStatus: string | undefined;
  //network toaster config
  toastrConfig = {
    timeOut: 1000,
    positionClass: 'toast-bottom-full-width',
    easing: 'ease-in',
  }
  taskDone: boolean = false;
  pendingTasks: any;
  completedTasks: any;

  //Task type options
  taskTypeArray = [
    {id:1, type:"Note" ,color: '#ECF9FF'},
    {id:2, type:"Note and Date", color: '#FFFBEB'},
    // {id:3, type:"Note, Date and Attachment", color: '#FFE7CC'}
  ];

  taskTypeValue:any = "Task type";
  showDatePicker: boolean = false;
  selectedDate!: Date;
  taskDueDate!: string;
  taskCreatedDate!: string;
  minDate!: Date;
  file!:File;
  showFileUpload: boolean = false;
  message$!: Observable<string>;


  //choose type of task to be entered in todo
  selectedTaskType() {
    this.showFileUpload = this.taskTypeValue.id === 3;
    this.showDatePicker = this.taskTypeValue.id === 2 || this.showFileUpload;
  
    const fileValidators = this.showFileUpload ? [Validators.required] : [];
    const dateValidators = this.showDatePicker ? [Validators.required] : [];
  
    this.taskForm.controls['fileInput'].setValidators(fileValidators);
    this.taskForm.controls['dueDateValue'].setValidators(dateValidators);
    this.taskForm.controls['fileInput'].updateValueAndValidity();
    this.taskForm.controls['dueDateValue'].updateValueAndValidity();
  
    this.taskObj.taskType = this.taskTypeValue.id;
  }
  
  //getting task creation and due date for the current task
  onDateSelection(event: any) {
    this.taskDueDate = JSON.stringify(this.datePipe.transform(event, 'MMMM d, y'));
    this.taskCreatedDate = JSON.stringify(this.datePipe.transform(new Date(), 'MMMM d, y'));
    this.taskCreatedDate = JSON.parse(this.taskCreatedDate)
  }

  //getting attachment
  getFile(event:any){
    this.file = event.target.files[0];
    this.crudService.fileUpload(this.file).subscribe((res)=>{
      console.log(res);   
    })
  }

  //task field form initilization and validation
  createTaskField(){
    this.taskForm = this.formBuilder.group({
      addTaskValue : ['',[Validators.required]],
      dueDateValue : [''],
      fileInput: ['']
    })
  }
  get taskvalue(){
    return this.taskForm.get('addTaskValue');
  }

  //method to add new task
  addTask() {
    this.taskObj = new Task();
    this.taskObj.task_name = this.taskForm.value.addTaskValue;
    this.taskObj.isCompleted = false;
    this.taskObj.taskCreatedDate = this.taskCreatedDate;
    this.taskObj.taskDueDate = this.taskDueDate ? JSON.parse(this.taskDueDate ?? ''): '';
    this.taskObj.taskType = this.taskTypeValue.id ?? 1;
    
    //saving task object in local storage
    // localStorage.setItem('task',JSON.stringify(this.taskObj));
  
    this.crudService.addTask(this.taskObj).subscribe(res => {
      this.getAllTask();
      this.toastr.success('New task has been added!');  
      this.taskForm.reset();
      this.showDatePicker = false;
      this.showFileUpload = false;
    });
  }

  //method to get task list
  getAllTask(){
    this.crudService.getAllTask().subscribe(res =>{
      this.taskArray = res;
      this.completedTasks = this.taskArray.filter((task:any) => task.isCompleted === true).length
      this.pendingTasks = this.taskArray.filter((task:any) => task.isCompleted === undefined || task.isCompleted === false).length;
    },(err)=>{
      //getting data from local storage when JSON server is offline
      // const localTaskData = localStorage.getItem('task') || '{}';
      // let parsedData = JSON.parse(localTaskData);
      // this.taskArray.push(parsedData);
    })
  }

  //delete task popup confirmation
  confirmDeleteTask(etask: Task, i:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete " + '- ' + etask.task_name + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(etask,i)
      }
    })
  }

  //method to delete a task
  deleteTask(etask: Task, i:any){
    this.crudService.deleteTask(etask).subscribe(res =>{
    this.getAllTask();
    Swal.fire(
      'Deleted!',
      'Task has been deleted.',
      'success'
    )
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

  //Get the online/offline status from browser window
  checkNetworkStatus(){      
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline'); 

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.connectionStatusMessage = 'Back online!';
      this.connectionStatus = 'online';
      console.warn('Online...');
      this.toastr.success(this.connectionStatusMessage, '', this.toastrConfig)
    }));  

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
      this.connectionStatus = 'offline';
      console.error('Offline...');
      this.toastr.error(this.connectionStatusMessage, '', this.toastrConfig)
    }));
  }

  confirmComplete(task:any){
    console.log(task);
    let status;
    task.isCompleted == true ? status = 'incomplete' : status = 'complete';
    Swal.fire({
      title: `Mark task as ${status}?`,
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.completeTask(task)
      }
    })
  }

  //Mark task as complete
  completeTask(task:any){
    // task.isCompleted = true;
    let { _id,...otherFields } = task;
    otherFields.isCompleted = !otherFields.isCompleted
    let obj = {_id,...otherFields}
    this.crudService.changeStatus(_id,obj).subscribe(res => {
      let message = Object.values(res);
        this.toastr.success(message[0]);
        this.getAllTask();  
    });
  }

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private store: Store<AppState>){
      this.message$ = this.store.select('message')
    }
  spanishMessage() {
    this.store.dispatch({type: 'SPANISH'})
  }

  frenchMessage() {
    this.store.dispatch({type: 'FRENCH'})
  }

  ngOnInit(): void {
    this.createTaskField();
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.taskArray = [];
    this.getAllTask();
    this.checkNetworkStatus();
    this.minDate = new Date();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

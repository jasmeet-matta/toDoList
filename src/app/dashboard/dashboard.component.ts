import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { CRUDService } from '../service/crud.service';
import * as alertifyjs from 'alertifyjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable, Subscription } from 'rxjs';


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
  toastrConfig = {
    timeOut: 1000,
    positionClass: 'toast-bottom-full-width',
    easing: 'ease-in',
  }

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
    this.taskObj = new Task();
    let taskValue = JSON.parse(JSON.stringify(this.taskForm.value));
    this.taskObj.task_name = taskValue.addTaskValue;
    this.crudService.addTask(this.taskObj).subscribe(res =>{
      this.getAllTask();
      this.toastr.success('New task has been added!');  
      this.taskForm.reset();
    })
    
  }

  //method to get task list
  getAllTask(){
    this.crudService.getAllTask().subscribe(res =>{
      this.taskArray = res;
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
      console.info('Online...');
      this.toastr.success(this.connectionStatusMessage, '', this.toastrConfig)
    }));  

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
      this.connectionStatus = 'offline';
      console.info('Offline...');
      this.toastr.error(this.connectionStatusMessage, '', this.toastrConfig)
    }));
  }

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.createTaskField();
    this.addTaskValue = '';
    this.taskObj = new Task();
    this.taskArray = [];
    this.getAllTask();
    this.checkNetworkStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

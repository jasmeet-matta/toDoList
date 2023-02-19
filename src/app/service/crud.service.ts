import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {

  public serviceURL: string;
  public uploadURL: string;

  constructor(private http: HttpClient) { 
    this.serviceURL = "http://localhost:3000/tasks";
    this.uploadURL =  "http://localhost:3000";
  }

  //method to add new task
  addTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.serviceURL, task);
  }

  //uploading file
  fileUpload(file: File){
    let formParams = new FormData();
    formParams.append('file', file)
    return this.http.post(this.uploadURL+'/uploads', formParams);
  }

  //method to get task list 
  getAllTask(): Observable<Task[]>{
    return this.http.get<Task[]>(this.serviceURL);
  }

  //method to delete a task
  deleteTask(task: Task): Observable<Task>{
    return this.http.delete<Task>(this.serviceURL + '/' + task.id);
  }

  //method to edit an exising task
  editTask(task: Task): Observable<Task>{
    return this.http.put<Task>(this.serviceURL + '/' + task.id,task);
  }

}

import { Directive, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[appPreventSpecialChars]'
})
export class PreventSpecialCharsDirective {

  constructor(private toast: ToastrService) { }

  @HostListener("keydown",["$event"])

  onKeyDown(event:any){
    const Keys = ["!","@","#","$","%","^","&","*","(",")","_","+","/","="];
    if(Keys.includes(event.key)){
      event.preventDefault();
      this.toast.info('Cannot enter special chracter ' + event.key)
    }
  }
}

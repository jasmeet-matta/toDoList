import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from './modal/modal.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { TextTransformPipe } from './pipe/text-transform.pipe';
import { PreventSpecialCharsDirective } from './prevent-special-chars.directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { PencilIcon } from 'primeng/icons/pencil';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ModalComponent,
    TextTransformPipe,
    PreventSpecialCharsDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ButtonModule,
    ChipModule,
    StyleClassModule,
    RippleModule,
    PencilIcon
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    BsModalService,
    TextTransformPipe,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

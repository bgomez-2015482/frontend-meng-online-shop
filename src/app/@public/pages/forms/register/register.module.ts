import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { DatepickerLegalAgeModule } from '@shared/calendar/datepicker-legal-age/datepicker-legal-age.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    DatepickerLegalAgeModule,
    FormsModule
  ]
})
export class RegisterModule { }

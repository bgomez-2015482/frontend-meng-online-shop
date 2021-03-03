import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerLegalAgeComponent } from './datepicker-legal-age.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [DatepickerLegalAgeComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule
  ],
  exports: [DatepickerLegalAgeComponent]
})
export class DatepickerLegalAgeModule { }

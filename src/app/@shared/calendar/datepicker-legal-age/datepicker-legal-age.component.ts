import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datepicker-legal-age',
  templateUrl: './datepicker-legal-age.component.html',
  styleUrls: ['./datepicker-legal-age.component.scss']
})
export class DatepickerLegalAgeComponent implements OnInit {

  currenDay = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDay()
  };
  minDate: NgbDateStruct = {
    year: this.currenDay.year - 100,
    month: this.currenDay.month,
    day: this.currenDay.day
  };
  maxDate: NgbDateStruct = {
    year: this.currenDay.year - 18,
    month: this.currenDay.month,
    day: this.currenDay.day
  };

  model: NgbDateStruct = this.maxDate;

  @Output() newDate = new EventEmitter<NgbDateStruct>();
  constructor() { }

  ngOnInit(): void {
  }

  selectDateChange() {
    console.log(this.model);
    this.newDate.emit(this.model);
  }

}

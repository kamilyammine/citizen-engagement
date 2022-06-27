import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.sass']
})
export class SubmitButtonComponent implements OnInit {
  @Input() form: FormGroup
  @Input() secondForm: FormGroup
  @Input() placeholdertext: string
  @Input() typeOfFeedback: string
  @Input() condition: boolean
  constructor() { }

  ngOnInit(): void {
    if(this.condition == undefined) this.condition = true;
  }

}

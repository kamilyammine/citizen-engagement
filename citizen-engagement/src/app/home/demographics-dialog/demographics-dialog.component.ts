import { Demographics } from './../feedback-details/feedback-details-config.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataModel } from 'src/app/shared/models/dialog-data.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { atLeastOne, emailWithoutEmptySpace, noEmptySpace, phoneNumberWithoutEmptySpace } from 'src/app/shared/validators/customLengthValidator.validator';

@Component({
  selector: 'app-demographics-dialog',
  templateUrl: './demographics-dialog.component.html',
  styleUrls: ['./demographics-dialog.component.sass']
})
export class DemographicsDialogComponent implements OnInit {
  details: Demographics;
  form: FormGroup;
  close = false;
  lookups: any;
  lang: string;
  type: string;
  isOther = false;
  constructor(
    public dialogRef: MatDialogRef<DemographicsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataModel<Demographics>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.details = this.data?.Data;
    this.lookups = this.data?.Lookups;
    this.lang = this.data?.lang;
    this.type = this.data?.type;
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      gender: [null, [noEmptySpace()]],
      ageRange: [null, [noEmptySpace()]],
      userType: [null, [noEmptySpace()]],
      firstName: [null, [noEmptySpace()]],
      lastName: [null, [noEmptySpace()]],
      address: [null, [noEmptySpace()]],
      email: [null, [emailWithoutEmptySpace()]],
      phone: [null, [phoneNumberWithoutEmptySpace()]],
    }, { validators: atLeastOne(Validators.required, ['email', 'phone']) });

    this.form.controls.userType.valueChanges.subscribe(v => {
      if (v === 'other') {
        this.isOther = true;
        this.form.addControl('other', this.fb.control(null, [Validators.required, noEmptySpace()]));
      } else {
        this.isOther = false;
        this.form.controls?.userType ? this.form.removeControl('other') : null
      }
    })
  }

  public buttonClicked(add) {
    this.dialogRef.close(add ? this.form.getRawValue() : null);
  }

  public closeDialog(val: boolean) {
    // if(this.form.pristine){
    //   this.buttonClicked(false)
    // } else
    this.close = val
  }

}

import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.sass']
})
export class MessageDialogComponent implements OnInit {
  lang: string;
  errorCode : string;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.errorCode = this.data
    this.lang = this.translate.defaultLang;
    this.translate.onDefaultLangChange.subscribe(changed => {
      this.lang = this.translate.defaultLang;
    });
  }

}

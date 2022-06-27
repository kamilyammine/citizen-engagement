import { Subscription, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class SnackbarService {
  translSubscription: Subscription;
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) { }

  openSnackBar(otext: string, action: string = null, position: MatSnackBarVerticalPosition = 'bottom', durationInMilliSeconds: number = 2500) {
    this.translate.get(otext).subscribe((res) => {
      otext = res;
      this.snackBar.open(otext, (action),
      { duration: durationInMilliSeconds,
        panelClass: 'successful-snackbar',
        horizontalPosition: 'center',
        verticalPosition: position
      });
    });
  }

  openWarningSnackBar(otext: string, action: string = null, position: MatSnackBarVerticalPosition = 'bottom', durationInMilliSeconds: number = 2500) {
    this.translSubscription =
      forkJoin(
       [ this.translate.get(otext),
        this.translate.get(action)]
      ).subscribe(([res1, res2]) => {
        otext = res1;
        action = res2;
        this.snackBar.open(otext, action,
          {
            duration: durationInMilliSeconds,
            panelClass: 'warn-snackbar',
            horizontalPosition: 'center',
            verticalPosition: position });
      });
  }

  disposeWarningSnackbarSubscription() {
    if (this.translSubscription) { this.translSubscription.unsubscribe(); }
  }
}

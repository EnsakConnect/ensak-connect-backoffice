import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  notify(message : string) {
    this._snackBar.open(message, 'Undo', {
      duration: 3000,
      horizontalPosition: "start",
      verticalPosition: "top"
    });
  }
}
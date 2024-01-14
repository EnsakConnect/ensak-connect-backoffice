import {Component} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Subscription} from "rxjs";
import {User} from "../../../core/model/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {NotificationService} from "../../../core/service/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required])
  })

  hide = true;

  public showLoading!: boolean;
  private subscriptions: Subscription[] = [];
  user!: User;


  constructor(private router: Router, private authenticationService: AuthService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.authenticationService.autoAuthUser()
    if (this.authenticationService.getIsAuth()) {

      this.user = this.authenticationService.getUserFromLocalCache();


      this.router.navigate(['/admin']);

    }
  }

  public onLogin(): void {
    const email = this.loginForm.controls.emailFormControl.value;
    const password = this.loginForm.controls.passwordFormControl.value;
    this.showLoading = true;
    this.subscriptions.push(
      // @ts-ignore
      this.authenticationService.login(email, password).subscribe(
        (response) => {
          console.log(response);
          this.authenticationService.login2(response.token);
          //this.authenticationService.addUserToLocalCache(response.user);

          this.showLoading = false;
          this.router.navigate(['/admin']);

        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false
        }
      )
    );


  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.notificationService.notify(message);
    } else {
      this.notificationService.notify('An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}

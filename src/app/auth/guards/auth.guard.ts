import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {NotificationService} from "../../core/service/notification.service";
import {AuthService} from "../service/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const authService = inject(AuthService);

  authService.autoAuthUser()
  if (!authService.getIsAuth()) {
    router.navigate(['/auth/login']).then(
      ()=>{
        notificationService.notify( `You need to log in to access this page`);
        return false
      }
    )

  }
  return true;
};

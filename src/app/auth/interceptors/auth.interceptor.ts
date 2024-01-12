import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes(`${authService.host}/auth/login`)) {
    return next(req);
  }
  
  authService.loadToken();
  const authToken = authService.getToken();
  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
  }
  return next(req);
};

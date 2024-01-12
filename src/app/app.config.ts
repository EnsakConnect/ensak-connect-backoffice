import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient, withFetch,
  withInterceptors, withJsonpSupport,
} from "@angular/common/http";
import {authInterceptor} from "./auth/interceptors/auth.interceptor";
import {errorInterceptor} from "./auth/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        authInterceptor, errorInterceptor
      ])
    )
  ]
};

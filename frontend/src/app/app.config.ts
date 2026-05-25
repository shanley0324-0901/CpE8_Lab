import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Added withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor'; // Import the interceptor we just created

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // This tells Angular to use your interceptor for every request
    )
  ]
};
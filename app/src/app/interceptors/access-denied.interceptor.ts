import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, throwError } from 'rxjs';
import { catchError } from 'rxjs';

/**
 * Access Denied Interceptor
 * 
 * This HTTP interceptor is responsible for handling HTTP responses and errors in the application.
 * It performs the following actions:
 * - If a response contains a "renewedToken" header, it updates the token in local storage.
 * - If a 401 (Unauthorized) error occurs, it clears local storage and redirects the user to the login page.
 */

export const accessDeniedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    map((event:HttpEvent<any>)=>{
    if(event instanceof HttpResponse){
      if(event.headers.get("renewedToken") != null){
        localStorage["token"] = JSON.stringify(event.headers.get("renewedToken"));
      }
      return event;
      }
    return event;
  }),
    catchError((err:HttpErrorResponse)=>{
      // Handle 401 Unauthorized errors
      if(err.status == 401){
        localStorage.clear();
        router.navigate(['login']);
      }
      return throwError(() => err);
    })
  );
};

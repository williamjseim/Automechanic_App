import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, throwError } from 'rxjs';
import { catchError } from 'rxjs';

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
      if(err.status == 401){
        localStorage.clear();
        router.navigate(['login']);
      }
      return throwError(() => err);
    })
  );
};

import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export const accessDeniedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(map((event:HttpEvent<any>)=>{
    if(event instanceof HttpResponse){
      console.log(req.headers)
      if(event.status == 401){
        router.navigate(['']);
      }
      return event;
    }
    return event;
  }));
};

import { HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';

// Auth interceptor, sets authorization header.
// Bearer token is added for every request.

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const Token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
    const refresh = localStorage.getItem('refreshtoken')?.replace(/^"|"$/g, '');
    if (!Token) {
      return next(req);
    }

    const req1 = req.clone({
      setHeaders: {
        Authorization: `Bearer ${Token}`,
        refreshtoken: refresh ?? ""
        
      },
    });
    return next(req1);
  } catch {
    return next(req)
  }
};

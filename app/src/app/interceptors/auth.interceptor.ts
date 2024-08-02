import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor
 * 
 * This HTTP interceptor is responsible for attaching authentication headers to outgoing requests.
 * It reads the Bearer token and refresh token from local storage and includes them in the request headers.
 * If no token is present, it allows the request to proceed without modification.
 */

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

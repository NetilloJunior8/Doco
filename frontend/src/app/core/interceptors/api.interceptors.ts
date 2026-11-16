import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  if (token && req.url.includes('/api/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/')) {
        inject(AuthService).logout();
      }
      const detail =
        err.error?.detail ||
        err.error?.message ||
        (err.status === 0
          ? 'No se pudo conectar con el servidor DOCO API.'
          : 'Error inesperado procesando la solicitud.');
      return throwError(() => ({ status: err.status, message: detail, fields: err.error?.fields }));
    })
  );
};

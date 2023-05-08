import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/administration/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthInterceptor {

  private tokenExpired$ = new Subject<void>();

  constructor(
    private authService : AuthService,
    private toastr :  ToastrService,
    private router : Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler, state: RouterStateSnapshot): Observable<HttpEvent<unknown>> {

    //if user is trying to login. no need to modify the headers
    if(request.url.includes('Account/Authenticate') || request.url.includes('Account/registration')){
      return next.handle(request);
    }

    //Add token to header
    const token = this.authService.getToken();
    if(token){
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
   
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) =>{
        this.authService.redirectUrl = this.router.routerState.snapshot.url;

        if(error.status === 401 && (request.url.includes('Account/registration') || request.url.includes('Account/Authenticate'))){
          console.log("Interceptor triggered")
          this.authService.redirectUrl = this.router.routerState.snapshot.url;
          this.tokenExpired$.next();
          //this.authService.logOut();
          this.toastr.info('Your session expired.', "Unauthorized")
        }
        return throwError(() => error);
      }),
      //unsubscribe from the observable when tokenExpired$ emits a value
      takeUntil(this.tokenExpired$)
    );
  }
}

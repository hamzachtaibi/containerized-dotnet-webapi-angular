import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationModule } from './administration/administration.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './repository/interceptor/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
    imports: [
        //System Modules
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => { return localStorage.getItem('kfl_at'); },
                allowedDomains: ['http://localhost:4200/', 'https://localhost:4200/'],
                disallowedRoutes: ['http://localhost:4200/login', 'https://localhost:4200/login','http://localhost:4200/registration', 'https://localhost:4200/registration']
            }
        }),
        
        //Project Modules
        DashboardModule,
        AdministrationModule,
        SharedModule,
    ]
})
export class AppModule { }

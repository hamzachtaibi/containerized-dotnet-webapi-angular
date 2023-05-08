import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';




@NgModule({
  declarations: [
    TopBarComponent,
    LeftSideBarComponent,
    SpinnerComponent,
    FooterComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    ToastrModule.forRoot({
      timeOut:4000,
      positionClass: 'toast-top-center',
      closeButton:true,

    }),
  ],
  exports: [
    TopBarComponent,
    LeftSideBarComponent,
    SpinnerComponent,
    FooterComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }

import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/administration/services/auth.service';
import { OrgMember } from 'src/app/models/orgMemberModel';
import { PayLoadTokenModel } from 'src/app/models/payLoadTokenModel';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  @ViewChild('RefbtnSideBar') btnSideBar!: ElementRef;
  payLoadToken!: PayLoadTokenModel;
  userImage:string = '';

  constructor(private authService: AuthService, private httpClient : HttpClient,) { }

  ngOnInit() {
    this.payLoadToken = this.authService.decodeToken();
    this.GetUserData();
  }


  ngAfterViewInit() {
    this.toggleSideBar();

  }


  onLogout() {
    this.authService.logOut();
  }

  //Get profile Data by Id
  GetUserData(){
    
    this.httpClient.get<OrgMember>(environment.ApiEmployeeById+this.payLoadToken.profileId).subscribe({
      next: (result: OrgMember) => {
        let image = result.imageProfile; 
        this.userImage = image? `data:image/${image}` : '../../../../assets/img/profileUserIcon.png';
      },
    }
      
    );

  }
  
  //Hide/Show SideBar CLICK Event
  toggleSideBar() {
    if (this.btnSideBar.nativeElement) {
      this.btnSideBar.nativeElement.addEventListener('click', () => {
        document.getElementById('dashboardBody')?.classList.toggle('toggle-sidebar');
      });
    }

  }
}

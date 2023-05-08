import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from 'src/app/models/UserSettings';
import { Needy } from 'src/app/models/needyModel';
import { OrgMember } from 'src/app/models/orgMemberModel';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

   /*======== Needy Controller ========*/

  getAllNeedy() : Observable<any[]>{
    return this.httpClient.get<any[]>(environment.ApiNeedyProfile);
  }

  getNeedyById(profileId:string) : Observable<any>{
    return this.httpClient.get<any>(environment.ApiNeedyById+profileId);

  }

  updateNeedyById(profileId:string, profileData : Needy){
    return this.httpClient.patch(environment.ApiNeedyProfile+profileId, profileData)
  }

  deleteNeedyProfile(profileId:string){
    return this.httpClient.delete(environment.ApiNeedyProfile+profileId);
  }
  
  addNeedyProfile(profileData : Needy) : Observable<Needy>{
    return this.httpClient.post<Needy>(environment.ApiNeedyProfile, profileData)
  }


  /*======== organization Members Controller ========*/

  getAllEmployees() : Observable<any[]>{
    return this.httpClient.get<any[]>(environment.ApiEmployeeProfile);
  }

  getEmployeeById(profileId:string) : Observable<any>{
    return this.httpClient.get<any>(environment.ApiEmployeeById+profileId);

  }

  updateEmployeeById(profileId:string, profileData : OrgMember){
    return this.httpClient.patch(environment.ApiEmployeeProfile+profileId, profileData)
  }

  deleteEmployeeProfile(profileId:string){
    return this.httpClient.delete(environment.ApiEmployeeProfile+profileId);
  }
  
  addEmployeeProfile(profileData : OrgMember) : Observable<OrgMember>{
    return this.httpClient.post<OrgMember>(environment.ApiEmployeeProfile, profileData);
  }


  changeUserRole(userId:string, settings:UserSettings) : Observable<any>{
    return this.httpClient.post<any>(environment.ApiChnageRole+userId, settings);
  }

  deleteUserAccount(idToDelete:string, accountRole:string, activeUserRole:string){
    let param = `${idToDelete}/${accountRole}/${activeUserRole}`;
    return this.httpClient.delete<any>(environment.ApiDeleteUserAccount+param)

  }
}

import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { data, error, get } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AdminService } from 'src/app/administration/services/admin.service';
import { AuthService } from 'src/app/administration/services/auth.service';
import { Needy } from 'src/app/models/needyModel';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.css',]
})
export class ProfilesListComponent {

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtInstance!: DataTables.Api;
  dtPage!: DataTables.PageMethods;
  dtTrigger: Subject<any> = new Subject<any>();
  parentCheckbox = null;
  childCheckboxesList = [];

  needyList: Needy[] = [];
  profileStatus:boolean = true;
  isLoading: boolean = false;
  selectedRows: string[] = [];
  router: any;



  constructor(private AdminService: AdminService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.BuildTable();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(null);

    this.onPageChange();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  /*=============== Table Configuration ================ */

  //DataTable config options, Columns, Data
  BuildTable(): void {
    this.dtOptions = {
      //Table Configuration
      search: {
        caseInsensitive: false,
      },
      scrollCollapse: true,
      autoWidth: true,
      pagingType: 'simple_numbers',
      language: {
        searchPlaceholder: 'Recherche...',
        search: '',
        paginate: {
          first: 'Premier',
          previous: 'Précédent',
          next: 'Prochain',
          last: 'Dernier',
        },
        lengthMenu: 'lines _MENU_ '
      },
      lengthMenu: [10, 25, 50, 100, 200],
      stateSave: false,
      info: false,

      processing: true, //Show loading animation
      //Calling Data
      ajax: {
        type: 'get',
        url: environment.ApiNeedyProfile,
        dataSrc: '',
        dataType: 'json',
        headers: {
          'Authorization': "Bearer " + this.authService.getToken(),
        }

      },
      rowId: (data) => data.id,

      //Setting Columns ; associate columns with data.
      columns: [
        {
          title: '<input type="checkbox" id="parentCheckbox">',
          data: null,
          searchable: false,
          orderable: false,
          render: function (data, type, row) {
            return '<input type="checkbox" class="childCheckbox" value="' + row.id + '">';
          }
        },
        {
          title: 'ID',
          data: 'id',
          visible: false
        },
        {
          title: 'Full name',
          data: 'fullName'
        },
        {
          title: 'Status',
          data:'',
          searchable: false,
          orderable: false,
          render: function (data, type, row) {
            return`<div class="form-check form-switch">
                      <input class="form-check-input switchStatusBtn" type="checkbox" role="switch" id="${row.id}" ${row.isActive? 'checked' : ''}>
                    </div>`
          }
        },
        {
          title: 'CIN',
          data: 'cin'
        },
        {
          title: 'Gender',
          data: ''
        },
        {
          title: 'Contact',
          data: ''
        },
        {
          title: 'Address',
          data: 'address',
        },
        {
          title: '',
          data: '',
          searchable: false,
          orderable: false,
          render: function (data, type, row) {
            return `<span class="m-1 btnDelete" title="Delete" >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg>
              </span>` +
              `<a class="m-1" href="dashboard/profile/edit/${row.id}" title="Edit" >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="green" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
              </a>` +
              `<a class="m-1" href="dashboard/profileDetails/${row.id}" title="Details" >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="blue" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
              </a>`

          }
        }

      ],
      // Set Custom Column Content.
      columnDefs: [
        {
          targets: 5,
          render: (data, type, row, meta) => {
            //Set date value
            let birthDate = row.birthDate ? row.birthDate : '';
            let gender = row.gender ? (row.gender == 'F') ? `Female` + `<br>` : `Male` + `<br>` : '';
            birthDate = birthDate !== '' ? formatDate(row.birthDate, 'dd-MM-yyyy', 'en') : '';
            return `${gender} ${birthDate}`;
          }
        },
        {
          targets: 6,
          render: (data, type, row, meta) => {
            let phone = row.phoneNumber ? row.phoneNumber : '';
            let email = row.email ? row.email + `<br>` : '';
            return `${email} ${phone}`;
          }
        },

      ],
      drawCallback: () => {
        //Add events to checkBoxes
        this.configCheckBoxTable();
      },
      createdRow: (row: Node, data) => {
        this.configDeleteRowBtn(row, data);
        this.configChangeStatusBtn(row, data);
      },
    }
  };

  
  //set the behaviour of table CheckBoxes.
  configCheckBoxTable() : void{
    // Get references to the parent and child checkboxes
    const ElmParentCheckbox = document.querySelector('#parentCheckbox');
    const ElmChildCheckboxes = document.querySelectorAll('.childCheckbox');
    // Add an event listener to the parent checkbox
    ElmParentCheckbox?.addEventListener('change', () => {
      ElmChildCheckboxes.forEach((checkbox) => {
        //let the childCheckbox inherit the ElmParentCheckbox Status.
        (checkbox as HTMLInputElement).checked = (ElmParentCheckbox as HTMLInputElement).checked;
        const checkboxId = (checkbox as HTMLInputElement).value; //get the id of the row/Profile.
        const isChecked = (checkbox as HTMLInputElement).checked;

        if (isChecked) {
          //if childCheckBox got checked
          //verify if it is added to the selectedRows list.
          if (!this.selectedRows.includes(checkboxId)) {
            this.selectedRows.push(checkboxId); //Add the id to the SelectedRows list.
          }
        } else {
          //if childCheckBox got unChecked
          const index = this.selectedRows.indexOf(checkboxId);
          if (index >= 0) {
            this.selectedRows.splice(index, 1); //Remove the id from the SelectedRows list.
          }
        }

      });

      console.log(this.selectedRows);
    });

    // Add event listeners to the child checkboxes
    ElmChildCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        // Check if all child checkboxes are checked
        let allChecked = true;
        const checkboxId = (checkbox as HTMLInputElement).value; //get the id of the row/Profile.
        const isChecked = (checkbox as HTMLInputElement).checked;

        //if childCheckBox got checked and not in SelectedRows list. then add it to the list.
        if (isChecked) {
          if (!this.selectedRows.includes(checkboxId)) {
            this.selectedRows.push(checkboxId);
          }

        } else {
          //if childCheckBox got unChecked, Remove the id from the SelectedRows list.
          const index = this.selectedRows.indexOf(checkboxId);
          if (index >= 0) {
            this.selectedRows.splice(index, 1);
          }

        }

        // Set the ElmParentCheckbox status based on the ElmChildCheckboxes.
        ElmChildCheckboxes.forEach((checkbox) => {
          const isChecked = (checkbox as HTMLInputElement).checked;
          if (!isChecked) {
            //if childCheckBox Not Checked
            allChecked = false; //To unCheck the ElmParentCheckbox.
          }
        });

        // Update the parent checkbox
        (ElmParentCheckbox as HTMLInputElement).checked = allChecked;

        console.log(this.selectedRows);
      });

    });
  }

  //Config event listener for delete row button
  configDeleteRowBtn(row:Node, data:any) : void{
    const btnDelete = (row as HTMLElement).querySelector('span.btnDelete');

        //Add event to delete button.
        if (btnDelete) {
          btnDelete.addEventListener('click', (event) => {
            let needyProfileData: Needy = { isNeedy: true,};
            needyProfileData = { ...needyProfileData, ...data };
            if (needyProfileData.id) {
              if(confirm('Êtes-vous sûr de vouloir supprimer ce profil?')){
                this.DeleteProfile(needyProfileData.id)
              }
              
            }

          });
        }
  }

  //Config event listener for ChangeStatus button
  configChangeStatusBtn(row:Node, data:any) : void{
    const btnStatus = (row as HTMLElement).querySelector('.switchStatusBtn');
        //Add event to delete button.
        if (btnStatus) {
          btnStatus.addEventListener('change', (event) => {
            let needyProfileData: Needy = { isNeedy: true};
            needyProfileData = { ...needyProfileData, ...data };
            let isChecked = (event.target as HTMLInputElement).checked;
            console.log(isChecked);
            if (needyProfileData.id) {
              //UPDATE THE STATUS.
              needyProfileData.isActive = isChecked;
              console.log("Try Update Status");
              this.UpdateStatus(needyProfileData.id, needyProfileData);
              console.log("Update Done");

            }

          });
        }
  }

  //Config button for delete selected Rows
  deleteSelectedRows(): void {
    if(confirm("Voulez-vous vraiment supprimer tous les profils sélectionnés?")){
      // Delete the selected row
      for (let i = 0; i < this.selectedRows.length; i++) {
        try{
        this.DeleteProfile(this.selectedRows[i]);
        } catch {

        }
      }

    }
    
  }


  /*=============== Table Associated Methods ================ */

  //Call to delete profile data from DB
  DeleteProfile(idToDelete: string): void {
    this.AdminService.deleteNeedyProfile(idToDelete).subscribe({
      next: (result: any) => {
        //show notification
        this.toastr.success("Profile successfully deleted", '');

        //remove the id from selectedRows list.
        //this will work if user tried to delete the records using the button delete Selected
        const index = this.selectedRows.indexOf(idToDelete);
        if (index >= 0) {
          this.selectedRows.splice(index, 1); //Remove the id from the SelectedRows list.
        }

        //remove the row from view
        this.removeRowFromView(idToDelete);
      },
      error: (er: HttpErrorResponse) => {
        this.toastr.error(er.error.description, '');
      }
    });

    
  }

  //Call to change profile Status : Active or Inactive
   UpdateStatus( profileId:string,needyProfileData:Needy): void {

    this.AdminService.updateNeedyById(profileId, needyProfileData).subscribe({
      next: (result: any) => {
        // Show Notification of success
        this.toastr.success(needyProfileData.isActive? "Profil activé avec succès." : "profil désactivé avec succès", '',)
      },
      error: (er : HttpErrorResponse) => {
        this.toastr.error("something went wrong", '',)

      },
    });


  }


  //Call to refresh/reload data table.
  refreshTable(): void {
    //clear the array of selected rows and uncheck the checkboxes.
    this.clearSelectedRows();

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  //Call to remove a row from view after a successful delete operation.
  removeRowFromView(id: string) :void {
    const table = $('#profilesList').DataTable();
    const rowNode = table.row(`#${id}`).node() as HTMLElement;

    if (rowNode) {
      table.row(rowNode).remove(); //remove row from Dom.
      const searchPageRows = table.rows({ search: 'applied' }).nodes(); // Get current page rows if search input is not empty
      
      if (searchPageRows.length === 0) { //if no more rows in Search Page
        table.search('').draw(); //redraw table and empty the search Input.
      }
      else{
        //redraw Table.
        table.draw();
      }
    }
    else {
      console.log(`Could not find row with id ${id}`);
    }

  }


  //Call to Clear the selectedRows, and uncheck the CheckBoxes; like when refreshing table...
  clearSelectedRows() {
    // Get references to the parent and child checkboxes
    const ElmParentCheckbox = document.querySelector('#parentCheckbox');
    const ElmChildCheckboxes = document.querySelectorAll('.childCheckbox');
    // uncheck the parent checkbox
    if (ElmParentCheckbox) {
      (ElmParentCheckbox as HTMLInputElement).checked = false;
    }

    // uncheck all child checkboxes
    if (ElmChildCheckboxes) {
      ElmChildCheckboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });
    }
    this.parentCheckbox = null;
    this.childCheckboxesList.length = 0;

    //Clear selected list
    this.selectedRows.length = 0;

  }

  //what to do when user navigate through table pages.
  async onPageChange(): Promise<void> {
    const dtInstance = await this.dtElement.dtInstance;

    //whenever user change the page
    dtInstance.on('page', () => {
      this.clearSelectedRows();
    });
  }


}

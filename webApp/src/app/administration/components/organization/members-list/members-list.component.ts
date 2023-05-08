import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/administration/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/administration/services/auth.service';
import { Needy } from 'src/app/models/needyModel';
import { environment } from 'src/environments/environment.development';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { OrgMember } from 'src/app/models/orgMemberModel';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtInstance!: DataTables.Api;
  dtPage!: DataTables.PageMethods;
  dtTrigger: Subject<any> = new Subject<any>();
  parentCheckbox = null;
  childCheckboxesList = [];

  membersList: OrgMember[] = [];
  memberStatus:boolean = true;
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
        url: environment.ApiEmployeeProfile,
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
          title: 'Nom et prénom',
          data: 'fullName'
        },
        {
          title: 'Statut',
          data:'',
          searchable: false,
          orderable: false,
          render: function (data, type, row) {
            return`<i class="bi bi-circle-fill" style="color: ${row.isActive? 'greenyellow' : 'lightgrey'};"></i>`
          }
        },
        {
          title: 'CIN',
          data: 'cin'
        },
        {
          title: 'Genre',
          data: ''
        },
        {
          title: 'Contact',
          data: ''
        },
        {
          title: 'Adresse',
          data: 'address',
        },
        {
          title: 'Action',
          data: '',
          searchable: false,
          orderable: false,
          render: function (data, type, row) {
            return `<span class="btn btn-link btn-sm m-1 btnDelete" title="Delete" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" class="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                    </svg>
            </span>` +
              `<a class="btn-sm  m-1" href="dashboard/member/profile/${row.id}" title="View" >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="grey" class="bi bi-gear" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"></path>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"></path>
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

      });

    });
  }

  //Config event listener for delete row button
  configDeleteRowBtn(row:Node, data:any) : void{
    const btnDelete = (row as HTMLElement).querySelector('span.btnDelete');

        //Add event to delete button.
        if (btnDelete) {
          btnDelete.addEventListener('click', (event) => {
            let memberProfileData: OrgMember = {isEmployee:true};
            memberProfileData = { ...memberProfileData, ...data };
            if (memberProfileData.id) {
              if(confirm('Êtes-vous sûr de vouloir supprimer ce profil?')){
                this.DeleteProfile(memberProfileData.id)
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
            let memberProfileData: OrgMember = {isEmployee :true};
            memberProfileData = { ...memberProfileData, ...data };
            let isChecked = (event.target as HTMLInputElement).checked;
            if (memberProfileData.id) {
              //UPDATE THE STATUS.
              memberProfileData.isActive = isChecked;
              this.UpdateStatus(memberProfileData.id, memberProfileData);

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
    this.AdminService.deleteEmployeeProfile(idToDelete).subscribe({
      next: (result: any) => {
        //show notification
        this.toastr.success("Profil supprimé avec succès", '');

        //remove the id from selectedRows list.
        //this will be executed if user tried to delete the records using the button delete Selected
        const index = this.selectedRows.indexOf(idToDelete);
        if (index >= 0) {
          this.selectedRows.splice(index, 1); //Remove the id from the SelectedRows list.
        }

        //remove the row from view
        this.removeRowFromView(idToDelete);
      },
      error: (er: HttpErrorResponse) => {
        this.toastr.error(er.error.description);
      }
    });

    
  }

  //Call to change profile Status : Active or Inactive
   UpdateStatus( profileId:string,EmployeeProfileData:OrgMember): void {

    this.AdminService.updateEmployeeById(profileId, EmployeeProfileData).subscribe({
      next: (result: any) => {
        // Show Notification of success
        this.toastr.success(EmployeeProfileData.isActive? "profil utilisateur activé avec succès." : "profil utilisateur désactivé avec succès", '',)
      },
      error: (er : HttpErrorResponse) => {
        this.toastr.error("Quelque chose s'est mal passé", '',)

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

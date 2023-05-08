let BaseApiUrl = "https://localhost:64895/api/v1/";

export const environment = {
    //******************** Account Controler*******************

    ApiAccountV1: `${BaseApiUrl}/Account/`,

    // Verify User Credentials
    ApiVerifyUser: `${BaseApiUrl}Account/VerifyUser/`,
    // Registration
    ApiRegisterUser : `${BaseApiUrl}Account/Registration/`,
    // Login
    ApiLogin : `${BaseApiUrl}Account/Authenticate/`,
    // Change password
    ApiChangePassword : `${BaseApiUrl}Account/ChangePassword/`,
    //Change user Role
    ApiChnageRole : `${BaseApiUrl}Account/setRole/`,
    //Delete user account
    ApiDeleteUserAccount: `${BaseApiUrl}Account/DeleteUserAccount/`,
    //Activate SuperAdmin Account
    ApiActivateSuperAdmin: `${BaseApiUrl}Account/superAdmin/`,
    //Verify superAdmin Existance
    ApiSuperAdminExist: `${BaseApiUrl}Account/superAdminExist/`,

    //******************** Profile Controler*******************

    //API ROUTE FOR person type Needy
    ApiNeedyProfile: `${BaseApiUrl}person/needy/`,
    ApiNeedyById: `${BaseApiUrl}person/needy/id/`,
    ApiNeedyByCin: `${BaseApiUrl}person/needy/cin/`,


    //API ROUTE FOR person type Employee/member
    ApiEmployeeProfile: `${BaseApiUrl}person/employee/`,
    ApiEmployeeById: `${BaseApiUrl}person/employee/id/`,
    ApiEmployeeByCin: `${BaseApiUrl}person/employee/cin/`

};

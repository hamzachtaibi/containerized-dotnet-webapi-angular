export interface PayLoadTokenModel{
    fullName?:string;
    email?:string;
    role?:string;
    accountId?:string;
    profileId?:string;

    [key: string]: any; // add index signature, will allow to access any property of Needy using a string key, even if that property is not explicitly defined in the interface.
}

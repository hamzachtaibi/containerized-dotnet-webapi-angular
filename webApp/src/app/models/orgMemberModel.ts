import { data } from "jquery";

export interface OrgMember {
    id?: string; 
    cin?: string;
    fullName?: string;
    birthDate?: Date;
    gender?: string;
    birthPlace?: string;
    academicLevel?: string;
    email?: string;
    phoneNumber?: string;
    profession?: string;
    address?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    imageProfile?: string;
    note?: string;
    registrationDate?: Date;
    profileUpdateTime?: Date;
    facebookAccount?: string;
    tweeterAccount?: string;
    instagramAccount?: string;
    linkedInAccount?: string;
    isEmployee: true;
    isActive?:boolean;
    role?:string | "membre";
    [key: string]: any; // add index signature, will allow to access any property of Needy using a string key, even if that property is not explicitly defined in the interface.
}
import { FormControl, FormGroup } from "@angular/forms";



export default class ValidateForm {

    //Show error message for invalid fields.
    static validateAllFields(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    /**********************************
   *  //Custom Validators
   **********************************/

    //Check it is a moroccan phone number.
    static isValidPhone(control: FormControl): { [key: string]: boolean } | null {
        // Define the pattern for Moroccan Phone
        const phoneNumberPattern: RegExp = /^00(212)\d{9}$/;

        // Check if the control value matches the pattern
        const isPhoneNumberValid = phoneNumberPattern.test(control.value);

        // Return null if the validation passes, or an object with an error message if it fails
        return isPhoneNumberValid ? null : { isValidPhone: true };
    }


    //check if is a and email.
    static isValidEmail(control: FormControl): { [key: string]: boolean } | null {
        // Define the pattern for Moroccan Phone
        const emailPattern : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Check if the control value matches the pattern
        const isValid : Boolean = emailPattern.test(control.value);

        // Return null if the validation passes, or an object with an error message if it fails
        return isValid ? null : { isValidEmail: true };
    }

    //Check picked date is before today
    static isBeforeToDay(control: FormControl): { [key: string]: boolean } | null {
        const birthdate = control.value;
        if (!birthdate) {
            // return null for required validator to handle empty input
            return null;
        }

        const chosendate = new Date(birthdate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (chosendate >= today) ? { maxDateValidator: true } : null;
    }


    //Detect Form Validation Status to change the Color arround the form
    static DetectFormStatus(ourForm: FormGroup, formStatus:string): void {
        console.log("hello");
        ourForm.statusChanges.subscribe((value) => {
            formStatus = 'VALID';
        });
    }


    //is valid password
    static isValidPasssword(control : FormControl) : null | {[key : string] : boolean}{
        //Define the pattern the verify the password.
        /*  - At least one digit.
            - At least one lowercase letter.
            - At least one uppercase letter.
            - At least one special character.
            - Length between 9 and 40 characters.
        */
        const passwordPattern : RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~\-={}[\]:;'"<>?,./]).{9,40}$/;

        const isValid : boolean = passwordPattern.test(control.value);

        return isValid ? null : {isValidPasssword : true};

    }

}
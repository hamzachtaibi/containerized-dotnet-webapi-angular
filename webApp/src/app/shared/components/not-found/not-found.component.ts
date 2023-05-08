import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  @Input() title!:string;
  @Input() indication!:string;
  @Input() showButton!:boolean;
}

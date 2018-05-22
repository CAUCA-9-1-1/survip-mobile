import { Component } from '@angular/core';

@Component({
  selector: 'menu-profile',
  templateUrl: 'menu-profile.html'
})
export class MenuProfileComponent {

  public fullName: string = '';

  constructor() {
    this.fullName = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
  }
}

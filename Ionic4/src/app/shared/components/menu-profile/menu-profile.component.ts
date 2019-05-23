import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss'],
})
export class MenuProfileComponent implements OnInit {

  public fullName: string = '';
  public version: any = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router) {
      this.version = authService.survipVersion;
      this.fullName = authService.userFirstName + ' ' + authService.userLastName;
    }

  ngOnInit() {}

  public async sessionLogout() {
    await this.authService.logout();
    await this.router.navigate(['login']);
  }
}

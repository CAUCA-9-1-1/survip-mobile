import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss'],
})
export class MenuProfileComponent implements OnInit {

  public get fullName(): string {
    return this.authService.userFirstName + ' ' + this.authService.userLastName;
  }

  public get version(): any {
    return this.authService.survipVersion || '';
  }

  constructor(
    private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit() {}

  public async sessionLogout() {
    await this.authService.logout();
    await this.router.navigate(['login']);
  }
}

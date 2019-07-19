import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentification.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root',
  })
export class LoginActivate implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) {
    }

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (await this.authService.isLoggedIn()) {
            this.router.navigate(['inspections-list']);
        } else {
            return true;
        }
    }
}

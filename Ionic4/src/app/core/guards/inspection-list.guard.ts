import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InspectionListGuard implements CanActivate {
  constructor(private menuController: MenuController) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    setTimeout(() => this.menuController.enable(true, 'inspection-list-menu'), 500);
    return true;
  }
}

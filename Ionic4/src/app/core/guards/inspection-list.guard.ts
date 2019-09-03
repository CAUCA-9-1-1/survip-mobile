import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { InspectionListControllerProvider } from '../services/controllers/inspection-list-controller/inspection-list-controller';

@Injectable({
  providedIn: 'root'
})
export class InspectionListGuard implements CanActivate {
  constructor(
    private menuController: MenuController,
    private inspectionListController: InspectionListControllerProvider) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.inspectionListController.refreshInspectionList();
    setTimeout(() => this.menuController.enable(true, 'inspection-list-menu'), 500);
    return true;
  }
}

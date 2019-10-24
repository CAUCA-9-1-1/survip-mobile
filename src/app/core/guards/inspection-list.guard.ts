import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { InspectionListControllerProvider } from '../services/controllers/inspection-list-controller/inspection-list-controller';

@Injectable({
  providedIn: 'root'
})
export class InspectionListGuard implements CanActivate {
  constructor(
    private inspectionListController: InspectionListControllerProvider) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.inspectionListController.refreshInspectionList();
    return true;
  }
}

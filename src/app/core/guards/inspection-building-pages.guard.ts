import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { InspectionControllerProvider } from '../services/controllers/inspection-controller/inspection-controller';

@Injectable({
  providedIn: 'root'
})
export class InspectionBuildingPagesGuard implements CanActivate {
  constructor(
    private inspectionController: InspectionControllerProvider) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const idBuilding = next.paramMap.get('idBuilding');
      const idInspection = next.paramMap.get('id');

      if (idInspection && idBuilding) {
        const loaded = await this.inspectionController.setIdInspection(idInspection, false);
        if (loaded) {
          this.inspectionController.setIdBuilding(idBuilding);
        }
        return loaded;
      } else {
        return false;
      }
  }}

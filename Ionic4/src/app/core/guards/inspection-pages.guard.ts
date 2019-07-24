import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Injectable({
  providedIn: 'root'
})
export class InspectionPagesGuard implements CanActivate {
  constructor(private inspectionController: InspectionControllerProvider) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const idInspection = next.paramMap.get('id');
      if (idInspection) {
        const loaded = await this.inspectionController.setIdInspection(idInspection, false);
        return loaded;
      } else {
        return false;
      }
  }
}

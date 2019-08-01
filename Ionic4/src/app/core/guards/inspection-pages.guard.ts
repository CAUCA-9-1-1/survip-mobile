import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InspectionPagesGuard implements CanActivate {
  constructor(
    private menuController: MenuController,
    private inspectionController: InspectionControllerProvider) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      console.log('activating route', next, state);
      const idInspection = next.paramMap.get('id');
      if (idInspection) {
        const loaded = await this.inspectionController.setIdInspection(idInspection, false);
        if (loaded) {
          this.menuController.enable(true, 'inspection-building-menu');
        }
        return loaded;
      } else {
        return false;
      }
  }
}

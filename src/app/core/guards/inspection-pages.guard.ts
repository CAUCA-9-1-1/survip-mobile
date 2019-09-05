import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { MenuController } from '@ionic/angular';
import { InspectionConfigurationProvider } from '../services/controllers/inspection-configuration/inspection-configuration';

@Injectable({
  providedIn: 'root'
})
export class InspectionPagesGuard implements CanActivate {
  constructor(
    private menuController: MenuController,
    private configurationService: InspectionConfigurationProvider,
    private inspectionController: InspectionControllerProvider) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const idInspection = next.paramMap.get('id');
      if (idInspection) {
        const loaded = await this.inspectionController.setIdInspection(idInspection, true);
        if (loaded) {
          setTimeout(async () => {
            await this.menuController.enable(true, 'inspection-menu');
            const menu = await this.menuController.get('inspection-menu');
            if (!menu.className.includes('menu-pane-visible')) {
              menu.className = menu.className + ' menu-pane-visible';
            }
          }, 200);
        }
        return loaded;
      } else {
        return false;
      }
  }
}

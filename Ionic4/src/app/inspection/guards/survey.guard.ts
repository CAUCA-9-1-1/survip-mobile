import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Injectable({
  providedIn: 'root'
})
export class SurveyGuard implements CanActivate  {
  constructor(
    private router: Router,
    private inspectionController: InspectionControllerProvider) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.inspectionController.inspectionIsLoaded) {
        return resolve(this.checkIfCanActivate());
      } else {
        this.inspectionController.inspectionLoaded.subscribe(() => {
            resolve(this.checkIfCanActivate());
        });
        this.inspectionController.setIdInspection(route.parent.paramMap.get('id'), false);
      }
    });
  }

  private checkIfCanActivate(): boolean {
    if (this.inspectionController.inspection.isSurveyCompleted) {
      const route = '/inspection/' + this.inspectionController.idInspection + '/survey-summary';
      this.router.navigate([route]);
      return false;
    } else {
      return true;
    }
  }
}

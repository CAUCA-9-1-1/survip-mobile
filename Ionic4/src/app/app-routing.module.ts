import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginActivate } from './core/guards/login.activate';
import { InspectionPagesGuard } from './core/guards/inspection-pages.guard';
import { InspectionBuildingPagesGuard } from './core/guards/inspection-building-pages.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'/*, canActivate: [LoginActivate]*/ },
  { path: 'inspections-list', loadChildren: './inspection-list/inspection-list.module#InspectionListPageModule' },
  {
    path: 'inspection/:id/buildings/:idBuilding',
    canActivate: [InspectionBuildingPagesGuard],
    loadChildren: './inspection-building/inspection-building.module#InspectionBuildingModule' },
  {
    path: 'inspection/:id',
    canActivate: [InspectionPagesGuard],
    loadChildren: './inspection/inspection.module#InspectionModule'},
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, /*{ preloadingStrategy: PreloadAllModules/*, enableTracing: true }*/)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


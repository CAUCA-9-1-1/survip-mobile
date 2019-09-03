import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginActivate } from './core/guards/login.activate';
import { InspectionPagesGuard } from './core/guards/inspection-pages.guard';
import { InspectionBuildingPagesGuard } from './core/guards/inspection-building-pages.guard';
import { InspectionListGuard } from './core/guards/inspection-list.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule), canActivate: [LoginActivate] },
  {
    path: 'inspections-list',
    canActivate: [InspectionListGuard],
    loadChildren: () => import('./inspection-list/inspection-list.module').then(m => m.InspectionListPageModule) },
  {
    path: 'inspection/:id/buildings/:idBuilding',
    canActivate: [InspectionBuildingPagesGuard],
    loadChildren: () => import('./inspection-building/inspection-building.module').then(m => m.InspectionBuildingModule) },
  {
    path: 'inspection/:id',
    canActivate: [InspectionPagesGuard],
    loadChildren: () => import('./inspection/inspection.module').then(m => m.InspectionModule)},
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules/*, enableTracing: true*/ })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


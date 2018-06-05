import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ComponentsModule} from '../../components/components.module';
import {HomePage} from "./home";

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(HomePage),
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule {}
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ComponentsModule} from '../../components/components.module';
import {HomePage} from "./home";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(HomePage),
        TranslateModule.forChild()
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule {}
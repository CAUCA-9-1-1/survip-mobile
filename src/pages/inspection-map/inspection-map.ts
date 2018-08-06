import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
//import {ContextService, DetailedContext, IgoMap} from 'igo2';

@IonicPage()
@Component({
  selector: 'page-inspection-map',
  templateUrl: 'inspection-map.html',
})
export class InspectionMapPage implements OnInit{
  //public map = new IgoMap();

  constructor(/*private contextService: ContextService,*/
              private authService: AuthenticationService,
              public navCtrl: NavController,
              public navParams: NavParams) {
  }

    public ngOnInit() {/*
    const layer1 = {
      'source': {
        'title': 'Fond de carte du Québec',
        'type': 'xyz',
        'url': 'https://geoegl.msp.gouv.qc.ca/cgi-wms/mapcache.fcgi/tms/1.0.0/carte_gouv_qc_ro@EPSG_3857/{z}/{x}/{-y}.png'
      }
    };

    this.contextService.setContext({
      'uri': 'default',
      'title': 'Default Context',
      'map': {
        'view': {
          'projection': 'EPSG:3857',
          'center': [-70.685006, 46.116211],
          'zoom': 14,
          'minZoom': 6,
          'maxZoom': 17
        }
      },
      'layers': [layer1]
    } as DetailedContext);*/
  }

    public async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }
}

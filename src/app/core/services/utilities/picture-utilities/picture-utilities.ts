import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InspectionConfigurationProvider } from '../../controllers/inspection-configuration/inspection-configuration';


@Injectable({providedIn: 'root'})
export class PictureUtilitiesProvider {

  constructor(
    private platform: Platform,
    private config: InspectionConfigurationProvider) {
  }

  public async pictureSizeIsValid(picUrl: string) {
    if (this.platform.is('cordova')) {
      picUrl = 'data:image/jpeg;base64,' + picUrl;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', picUrl, true);
    xhr.responseType = 'blob';
    const imageBlob = await new Promise((resolve) => {
      xhr.onload = () => {
        if (xhr.status === 200 && xhr.response.type.startsWith('image/')) {
          if ((xhr.response.size / 1000000.0) < this.config.configuration.maxUploadSize) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      };
      xhr.send();
    });

    return imageBlob;
  }
}

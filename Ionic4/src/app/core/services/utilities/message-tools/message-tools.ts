import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class MessageToolsProvider {

    public labels = {};

    constructor(public http: HttpClient,
                private alertCtrl: AlertController,
                private toastCtrl: ToastController,
                private translateService: TranslateService) {

        this.translateService.get([
            'yes', 'no'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error);
            });
    }


    public ShowMessageBox(title: string, message: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            const alert = await this.alertCtrl.create({
                header: title,
                message,
                buttons: [
                    {
                        text: this.labels['yes'], handler: () => {
                            resolve(true);
                        }
                    },
                    {
                        text: this.labels['no'], handler: () => {
                            resolve(false);
                        }
                    }
                ]
            });

            return alert.present();
        });
    }

    public async showToast(message: string, secondDelay: number = 3): Promise<any> {
        const toast = await this.toastCtrl.create({
            message,
            duration: (secondDelay * 1000),
            position: 'bottom'
        });

        return toast.present();
    }
}

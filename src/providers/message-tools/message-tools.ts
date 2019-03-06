import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, ToastController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";

@Injectable()

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
                console.log(error)
            });
    }


    public ShowMessageBox(title: string, message: string): Promise<Boolean> {
        return new Promise((resolve) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
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

            return alert.present()
        });
    }

    public showToast(message: string, second_delay: number = 3): Promise<any> {
        let toast = this.toastCtrl.create({
            message: message,
            duration: (second_delay * 1000),
            position: 'bottom'
        });

        return toast.present();
    }
}

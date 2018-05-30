import { HttpClient } from '@angular/common/http';
import {Component, Injectable, ɵisPromise} from '@angular/core';
import { AlertController, ToastController} from 'ionic-angular';

@Injectable()

export class MessageToolsProvider {

  constructor(public http: HttpClient,private alertCtrl: AlertController,private toastCtrl: ToastController,) {
  }

    public ShowMessageBox(title : string, message : string) : Promise<Boolean> {
        return new Promise((resolve, rejeect) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {text: 'Oui', handler: () => { resolve(true); }},
                    {text: 'Non', handler: () => { resolve(false); }}
                ]});

            return alert.present()
        });
    }

    public showToast(message: string, second_delay : number = 3){
        let toast = this.toastCtrl.create({
            message: message,
            duration: (second_delay * 1000),
            position: 'bottom'
        });

        toast.present();
    }
}
